const pool = require('../config/db');

exports.list = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  res.render('categories/list', { title: 'Danh mục', categories: rows });
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    req.session.flash = { type: 'danger', message: 'Tên danh mục không được để trống' };
    return res.redirect('/categories');
  }
  try {
    const [[dup]] = await pool.query('SELECT id FROM categories WHERE name = ? LIMIT 1', [name]);
    if (dup) {
      req.session.flash = { type: 'danger', message: 'Tên danh mục đã tồn tại' };
      return res.redirect('/categories');
    }
    await pool.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
    req.session.flash = { type: 'success', message: 'Đã thêm danh mục' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể thêm danh mục' };
  }
  return res.redirect('/categories');
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) {
    req.session.flash = { type: 'danger', message: 'Tên danh mục không được để trống' };
    return res.redirect('/categories');
  }
  try {
    const [[dup]] = await pool.query('SELECT id FROM categories WHERE name = ? AND id <> ? LIMIT 1', [
      name,
      id
    ]);
    if (dup) {
      req.session.flash = { type: 'danger', message: 'Tên danh mục đã tồn tại' };
      return res.redirect('/categories');
    }
    await pool.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [
      name,
      description || null,
      id
    ]);
    req.session.flash = { type: 'success', message: 'Đã cập nhật danh mục' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể cập nhật danh mục' };
  }
  return res.redirect('/categories');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ cnt }]] = await pool.query('SELECT COUNT(*) AS cnt FROM products WHERE category_id = ?', [id]);
    if (cnt > 0) {
      req.session.flash = { type: 'danger', message: 'Danh mục đã có sản phẩm, không thể xóa' };
      return res.redirect('/categories');
    }
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    req.session.flash = { type: 'success', message: 'Đã xóa danh mục' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể xóa danh mục' };
  }
  return res.redirect('/categories');
};
