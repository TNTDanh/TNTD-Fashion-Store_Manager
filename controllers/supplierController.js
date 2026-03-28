const pool = require('../config/db');

exports.list = async (req, res) => {
  const [suppliers] = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
  res.render('suppliers/list', { title: 'Nhà cung cấp', suppliers });
};

exports.create = async (req, res) => {
  const { name, phone, email, address } = req.body;
  await pool.query(
    'INSERT INTO suppliers (name, phone, email, address) VALUES (?,?,?,?)',
    [name, phone || null, email || null, address || null]
  );
  res.redirect('/suppliers');
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  await pool.query(
    'UPDATE suppliers SET name=?, phone=?, email=?, address=? WHERE id=?',
    [name, phone || null, email || null, address || null, id]
  );
  res.redirect('/suppliers');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
  res.redirect('/suppliers');
};
