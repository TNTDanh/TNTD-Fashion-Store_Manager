const pool = require('../config/db');

exports.list = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT pr.*, s.name AS supplier_name, u.username
     FROM purchase_receipts pr
     JOIN suppliers s ON pr.supplier_id = s.id
     JOIN users u ON pr.user_id = u.id
     ORDER BY pr.receipt_date DESC`
  );
  res.render('purchases/list', { title: 'Phiếu nhập', receipts: rows });
};

exports.detail = async (req, res) => {
  const { id } = req.params;
  const [[receipt]] = await pool.query(
    `SELECT pr.*, s.name AS supplier_name, u.username
     FROM purchase_receipts pr
     JOIN suppliers s ON pr.supplier_id = s.id
     JOIN users u ON pr.user_id = u.id
     WHERE pr.id = ?`,
    [id]
  );
  const [items] = await pool.query(
    `SELECT pri.*, pv.sku, pv.size, pv.color, p.name AS product_name
     FROM purchase_receipt_items pri
     JOIN product_variants pv ON pri.product_variant_id = pv.id
     JOIN products p ON pv.product_id = p.id
     WHERE pri.receipt_id = ?`,
    [id]
  );
  res.render('purchases/detail', { title: 'Chi tiết phiếu nhập', receipt, items });
};

exports.newForm = async (req, res) => {
  const [suppliers] = await pool.query('SELECT id, name FROM suppliers ORDER BY name');
  const [variants] = await pool.query(
    `SELECT pv.id, pv.sku, pv.size, pv.color, pv.price, pv.cost, p.name AS product_name
     FROM product_variants pv
     JOIN products p ON pv.product_id = p.id
     ORDER BY p.name, pv.sku`
  );
  res.render('purchases/form', { title: 'Tạo phiếu nhập', suppliers, variants });
};

exports.create = async (req, res) => {
  const { supplier_id, receipt_date, note } = req.body;
  let { variant_id: variantIds, quantity: quantities, unit_cost: unitCosts } = req.body;

  if (!supplier_id || !receipt_date) {
    req.session.flash = { type: 'danger', message: 'Nhà cung cấp và ngày giờ là bắt buộc' };
    return res.redirect('/purchases/new');
  }

  if (!Array.isArray(variantIds)) variantIds = [variantIds];
  if (!Array.isArray(quantities)) quantities = [quantities];
  if (!Array.isArray(unitCosts)) unitCosts = [unitCosts];

  const items = variantIds
    .map((v, idx) => ({
      variantId: Number(v),
      quantity: Number(quantities[idx]),
      unitCost: Number(unitCosts[idx])
    }))
    .filter((i) => i.variantId && i.quantity > 0 && i.unitCost >= 0);

  if (!items.length) {
    req.session.flash = { type: 'danger', message: 'Chưa có dòng hàng hóa hợp lệ' };
    return res.redirect('/purchases/new');
  }

  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO purchase_receipts (supplier_id, user_id, receipt_date, total_amount, note) VALUES (?,?,?,?,?)',
      [supplier_id, req.session.user.id, receipt_date, totalAmount, note || null]
    );
    const receiptId = result.insertId;

    for (const item of items) {
      const lineTotal = item.quantity * item.unitCost;
      await conn.query(
        `INSERT INTO purchase_receipt_items (receipt_id, product_variant_id, quantity, unit_cost, line_total)
         VALUES (?,?,?,?,?)`,
        [receiptId, item.variantId, item.quantity, item.unitCost, lineTotal]
      );
      await conn.query(
        'UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.variantId]
      );
      await conn.query(
        `INSERT INTO inventory_movements (product_variant_id, movement_type, ref_type, ref_id, quantity, note)
         VALUES (?,?,?,?,?,?)`,
        [item.variantId, 'purchase', 'purchase_receipt', receiptId, item.quantity, 'Nhập hàng']
      );
    }
    await conn.commit();
    return res.redirect(`/purchases/${receiptId}`);
  } catch (err) {
    await conn.rollback();
    req.session.flash = { type: 'danger', message: 'Lỗi tạo phiếu nhập' };
    return res.redirect('/purchases');
  } finally {
    conn.release();
  }
};
