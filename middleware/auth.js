exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) return next();
  req.session.returnTo = req.originalUrl;
  return res.redirect('/auth/login');
};
exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).render('error', { title: 'Access denied', message: 'You do not have permission to access this page.' });
};
exports.isRider = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'rider') return next();
  return res.status(403).render('error', { title: 'Access denied', message: 'This page is only available to rider accounts.' });
};
