const pool = require('../config/db');

exports.list = async (req, res) => {
  const [products] = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     JOIN categories c ON p.category_id = c.id
     ORDER BY p.created_at DESC`
  );
  res.render('products/list', { title: 'Sản phẩm', products });
};

exports.newForm = async (req, res) => {
  const [categories] = await pool.query('SELECT id, name FROM categories ORDER BY name');
  res.render('products/form', { title: 'Thêm sản phẩm', product: null, categories });
};

exports.create = async (req, res) => {
  const { category_id, name, code, description, is_active } = req.body;
  await pool.query(
    'INSERT INTO products (category_id, name, code, description, is_active) VALUES (?,?,?,?,?)',
    [category_id, name, code, description || null, is_active ? 1 : 0]
  );
  res.redirect('/products');
};

exports.editForm = async (req, res) => {
  const { id } = req.params;
  const [[product]] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  const [categories] = await pool.query('SELECT id, name FROM categories ORDER BY name');
  res.render('products/form', { title: 'Chỉnh sửa sản phẩm', product, categories });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, code, description, is_active } = req.body;
  await pool.query(
    'UPDATE products SET category_id=?, name=?, code=?, description=?, is_active=? WHERE id=?',
    [category_id, name, code, description || null, is_active ? 1 : 0, id]
  );
  res.redirect('/products');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  res.redirect('/products');
};
