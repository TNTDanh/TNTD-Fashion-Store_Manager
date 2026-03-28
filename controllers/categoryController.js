const pool = require('../config/db');

exports.list = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  res.render('categories/list', { title: 'Danh mục', categories: rows });
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  await pool.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
  res.redirect('/categories');
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  await pool.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [
    name,
    description || null,
    id
  ]);
  res.redirect('/categories');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  res.redirect('/categories');
};
