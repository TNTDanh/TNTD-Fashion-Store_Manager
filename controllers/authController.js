const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function verifyPassword(input, stored) {
  if (!stored) return false;
  if (stored.startsWith('$2')) {
    return bcrypt.compare(input, stored);
  }
  return input === stored;
}

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Đăng nhập' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) {
      req.session.flash = { type: 'danger', message: 'Tài khoản không tồn tại' };
      return res.redirect('/login');
    }
    const user = rows[0];
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      req.session.flash = { type: 'danger', message: 'Sai mật khẩu' };
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, username: user.username, role: user.role };
    return res.redirect('/dashboard');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    req.session.flash = { type: 'danger', message: 'Lỗi đăng nhập' };
    return res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
