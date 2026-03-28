const pool = require('../config/db');

exports.list = async (req, res) => {
  const [customers] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
  res.render('customers/list', { title: 'Khách hàng', customers });
};

exports.create = async (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name) {
    req.session.flash = { type: 'danger', message: 'Tên khách hàng không được để trống' };
    return res.redirect('/customers');
  }
  try {
    await pool.query(
      'INSERT INTO customers (name, phone, email, address) VALUES (?,?,?,?)',
      [name, phone || null, email || null, address || null]
    );
    req.session.flash = { type: 'success', message: 'Đã thêm khách hàng' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể thêm khách hàng' };
  }
  return res.redirect('/customers');
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  if (!name) {
    req.session.flash = { type: 'danger', message: 'Tên khách hàng không được để trống' };
    return res.redirect('/customers');
  }
  try {
    await pool.query(
      'UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?',
      [name, phone || null, email || null, address || null, id]
    );
    req.session.flash = { type: 'success', message: 'Đã cập nhật khách hàng' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể cập nhật khách hàng' };
  }
  return res.redirect('/customers');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ cnt }]] = await pool.query('SELECT COUNT(*) AS cnt FROM sales_invoices WHERE customer_id = ?', [id]);
    if (cnt > 0) {
      req.session.flash = { type: 'danger', message: 'Khách hàng đã có giao dịch, không thể xóa' };
      return res.redirect('/customers');
    }
    await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    req.session.flash = { type: 'success', message: 'Đã xóa khách hàng' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể xóa khách hàng' };
  }
  return res.redirect('/customers');
};
