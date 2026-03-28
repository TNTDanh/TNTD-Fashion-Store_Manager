const pool = require('../config/db');

exports.list = async (req, res) => {
  const [suppliers] = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
  res.render('suppliers/list', { title: 'Nhà cung cấp', suppliers });
};

exports.create = async (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name) {
    req.session.flash = { type: 'danger', message: 'Tên nhà cung cấp không được để trống' };
    return res.redirect('/suppliers');
  }
  try {
    await pool.query(
      'INSERT INTO suppliers (name, phone, email, address) VALUES (?,?,?,?)',
      [name, phone || null, email || null, address || null]
    );
    req.session.flash = { type: 'success', message: 'Đã thêm nhà cung cấp' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể thêm nhà cung cấp' };
  }
  return res.redirect('/suppliers');
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  if (!name) {
    req.session.flash = { type: 'danger', message: 'Tên nhà cung cấp không được để trống' };
    return res.redirect('/suppliers');
  }
  try {
    await pool.query(
      'UPDATE suppliers SET name=?, phone=?, email=?, address=? WHERE id=?',
      [name, phone || null, email || null, address || null, id]
    );
    req.session.flash = { type: 'success', message: 'Đã cập nhật nhà cung cấp' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể cập nhật nhà cung cấp' };
  }
  return res.redirect('/suppliers');
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ cnt }]] = await pool.query('SELECT COUNT(*) AS cnt FROM purchase_receipts WHERE supplier_id = ?', [id]);
    if (cnt > 0) {
      req.session.flash = { type: 'danger', message: 'Nhà cung cấp đã có giao dịch, không thể xóa' };
      return res.redirect('/suppliers');
    }
    await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
    req.session.flash = { type: 'success', message: 'Đã xóa nhà cung cấp' };
  } catch (err) {
    req.session.flash = { type: 'danger', message: 'Không thể xóa nhà cung cấp' };
  }
  return res.redirect('/suppliers');
};
