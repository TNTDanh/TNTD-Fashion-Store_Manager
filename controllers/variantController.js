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
  await pool.query(
    `INSERT INTO product_variants (product_id, size, color, sku, price, cost, stock_quantity)
     VALUES (?,?,?,?,?,?,?)`,
    [product_id, size, color, sku, price, cost, stock_quantity || 0]
  );
  res.redirect('/variants');
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
  await pool.query(
    `UPDATE product_variants
     SET product_id=?, size=?, color=?, sku=?, price=?, cost=?, stock_quantity=?
     WHERE id=?`,
    [product_id, size, color, sku, price, cost, stock_quantity || 0, id]
  );
  res.redirect('/variants');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM product_variants WHERE id = ?', [id]);
  res.redirect('/variants');
};
