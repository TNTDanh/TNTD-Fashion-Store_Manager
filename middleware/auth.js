function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
}

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) return res.redirect('/login');
    if (roles.length === 0 || roles.includes(req.session.user.role)) return next();
    req.session.flash = { type: 'danger', message: 'Bạn không có quyền truy cập chức năng này' };
    return res.redirect('/dashboard');
  };
}

function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.user) return res.redirect('/dashboard');
  return next();
}

module.exports = { ensureAuthenticated, redirectIfAuthenticated, requireRole };
