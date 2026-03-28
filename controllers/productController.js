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
  if (!category_id || !name || !code) {
    req.session.flash = { type: 'danger', message: 'Danh mục, tên và mã sản phẩm là bắt buộc' };
    return res.redirect('/products/new');
  }
  try {
    const [[dup]] = await pool.query('SELECT id FROM products WHERE code = ? LIMIT 1', [code]);
    if (dup) {
      req.session.flash = { type: 'danger', message: 'Mã sản phẩm đã tồn tại' };
      return res.redirect('/products/new');
    }
    await pool.query(
      'INSERT INTO products (category_id, name, code, description, is_active) VALUES (?,?,?,?,?)',
      [category_id, name, code, description || null, is_active ? 1 : 0]
    );
    req.session.flash = { type: 'success', message: 'Đã thêm sản phẩm' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể thêm sản phẩm' };
  }
  return res.redirect('/products');
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
  if (!category_id || !name || !code) {
    req.session.flash = { type: 'danger', message: 'Danh mục, tên và mã sản phẩm là bắt buộc' };
    return res.redirect(`/products/${id}/edit`);
  }
  try {
    const [[dup]] = await pool.query('SELECT id FROM products WHERE code = ? AND id <> ? LIMIT 1', [
      code,
      id
    ]);
    if (dup) {
      req.session.flash = { type: 'danger', message: 'Mã sản phẩm đã tồn tại' };
      return res.redirect(`/products/${id}/edit`);
    }
    await pool.query(
      'UPDATE products SET category_id=?, name=?, code=?, description=?, is_active=? WHERE id=?',
      [category_id, name, code, description || null, is_active ? 1 : 0, id]
    );
    req.session.flash = { type: 'success', message: 'Đã cập nhật sản phẩm' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể cập nhật sản phẩm' };
  }
  return res.redirect('/products');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ cnt }]] = await pool.query('SELECT COUNT(*) AS cnt FROM product_variants WHERE product_id = ?', [id]);
    if (cnt > 0) {
      req.session.flash = { type: 'danger', message: 'Sản phẩm đã có biến thể, không thể xóa' };
      return res.redirect('/products');
    }
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    req.session.flash = { type: 'success', message: 'Đã xóa sản phẩm' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể xóa sản phẩm' };
  }
  return res.redirect('/products');
};
