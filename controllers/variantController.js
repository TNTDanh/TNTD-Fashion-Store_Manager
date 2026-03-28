const pool = require('../config/db');

exports.list = async (req, res) => {
  const [variants] = await pool.query(
    `SELECT pv.*, p.name AS product_name
     FROM product_variants pv
     JOIN products p ON pv.product_id = p.id
     ORDER BY pv.created_at DESC`
  );
  res.render('variants/list', { title: 'Biến thể sản phẩm', variants });
};

exports.newForm = async (req, res) => {
  const [products] = await pool.query('SELECT id, name FROM products ORDER BY name');
  res.render('variants/form', { title: 'Thêm biến thể', variant: null, products });
};

exports.create = async (req, res) => {
  const { product_id, size, color, sku, price, cost, stock_quantity } = req.body;
  if (!product_id || !size || !color || !sku) {
    req.session.flash = { type: 'danger', message: 'Thiếu thông tin bắt buộc' };
    return res.redirect('/variants/new');
  }
  if (Number(price) < 0 || Number(cost) < 0 || Number(stock_quantity) < 0) {
    req.session.flash = { type: 'danger', message: 'Giá/ tồn phải lớn hơn hoặc bằng 0' };
    return res.redirect('/variants/new');
  }
  try {
    const [[dupSku]] = await pool.query('SELECT id FROM product_variants WHERE sku = ? LIMIT 1', [sku]);
    if (dupSku) {
      req.session.flash = { type: 'danger', message: 'SKU đã tồn tại' };
      return res.redirect('/variants/new');
    }
    const [[dupCombo]] = await pool.query(
      'SELECT id FROM product_variants WHERE product_id = ? AND size = ? AND color = ? LIMIT 1',
      [product_id, size, color]
    );
    if (dupCombo) {
      req.session.flash = { type: 'danger', message: 'Biến thể kích cỡ/màu này đã tồn tại' };
      return res.redirect('/variants/new');
    }
    await pool.query(
      `INSERT INTO product_variants (product_id, size, color, sku, price, cost, stock_quantity)
       VALUES (?,?,?,?,?,?,?)`,
      [product_id, size, color, sku, price, cost, stock_quantity || 0]
    );
    req.session.flash = { type: 'success', message: 'Đã thêm biến thể' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể thêm biến thể' };
  }
  return res.redirect('/variants');
};

exports.editForm = async (req, res) => {
  const { id } = req.params;
  const [[variant]] = await pool.query('SELECT * FROM product_variants WHERE id = ?', [id]);
  const [products] = await pool.query('SELECT id, name FROM products ORDER BY name');
  res.render('variants/form', { title: 'Chỉnh sửa biến thể', variant, products });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { product_id, size, color, sku, price, cost, stock_quantity } = req.body;
  if (!product_id || !size || !color || !sku) {
    req.session.flash = { type: 'danger', message: 'Thiếu thông tin bắt buộc' };
    return res.redirect(`/variants/${id}/edit`);
  }
  if (Number(price) < 0 || Number(cost) < 0 || Number(stock_quantity) < 0) {
    req.session.flash = { type: 'danger', message: 'Giá/ tồn phải lớn hơn hoặc bằng 0' };
    return res.redirect(`/variants/${id}/edit`);
  }
  try {
    const [[dupSku]] = await pool.query('SELECT id FROM product_variants WHERE sku = ? AND id <> ? LIMIT 1', [
      sku,
      id
    ]);
    if (dupSku) {
      req.session.flash = { type: 'danger', message: 'SKU đã tồn tại' };
      return res.redirect(`/variants/${id}/edit`);
    }
    const [[dupCombo]] = await pool.query(
      'SELECT id FROM product_variants WHERE product_id = ? AND size = ? AND color = ? AND id <> ? LIMIT 1',
      [product_id, size, color, id]
    );
    if (dupCombo) {
      req.session.flash = { type: 'danger', message: 'Biến thể kích cỡ/màu này đã tồn tại' };
      return res.redirect(`/variants/${id}/edit`);
    }
    await pool.query(
      `UPDATE product_variants
       SET product_id=?, size=?, color=?, sku=?, price=?, cost=?, stock_quantity=?
       WHERE id=?`,
      [product_id, size, color, sku, price, cost, stock_quantity || 0, id]
    );
    req.session.flash = { type: 'success', message: 'Đã cập nhật biến thể' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể cập nhật biến thể' };
  }
  return res.redirect('/variants');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ cntPurchase }]] = await pool.query(
      'SELECT COUNT(*) AS cntPurchase FROM purchase_receipt_items WHERE product_variant_id = ?',
      [id]
    );
    const [[{ cntSales }]] = await pool.query(
      'SELECT COUNT(*) AS cntSales FROM sales_invoice_items WHERE product_variant_id = ?',
      [id]
    );
    if (cntPurchase > 0 || cntSales > 0) {
      req.session.flash = { type: 'danger', message: 'Biến thể đã phát sinh giao dịch, không thể xóa' };
      return res.redirect('/variants');
    }
    await pool.query('DELETE FROM product_variants WHERE id = ?', [id]);
    req.session.flash = { type: 'success', message: 'Đã xóa biến thể' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể xóa biến thể' };
  }
  return res.redirect('/variants');
};
