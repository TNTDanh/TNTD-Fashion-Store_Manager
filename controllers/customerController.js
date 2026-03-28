const pool = require('../config/db');

exports.list = async (req, res) => {
  const [customers] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
  res.render('customers/list', { title: 'Khách hàng', customers });
};

exports.create = async (req, res) => {
  const { name, phone, email, address } = req.body;
  await pool.query(
    'INSERT INTO customers (name, phone, email, address) VALUES (?,?,?,?)',
    [name, phone || null, email || null, address || null]
  );
  res.redirect('/customers');
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  await pool.query(
    'UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?',
    [name, phone || null, email || null, address || null, id]
  );
  res.redirect('/customers');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM customers WHERE id = ?', [id]);
  res.redirect('/customers');
};
