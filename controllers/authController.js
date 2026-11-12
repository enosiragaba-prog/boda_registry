const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Rider = require('../models/Rider');

exports.loginForm = (req, res) => res.render('auth/login', { title: 'Sign in', error: null });
exports.registerForm = (req, res) => res.render('auth/register', { title: 'Rider registration', error: null });
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone, nationalId, licenseNumber, stage, district } = req.body;
    if (!name || !email || !password || !phone) return res.status(400).render('auth/register', { title: 'Rider registration', error: 'Please complete all required fields.' });
    if (password.length < 8) return res.status(400).render('auth/register', { title: 'Rider registration', error: 'Use a password with at least 8 characters.' });
    if (password !== confirmPassword) return res.status(400).render('auth/register', { title: 'Rider registration', error: 'Passwords do not match.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).render('auth/register', { title: 'Rider registration', error: 'An account with that email already exists.' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hash, role: 'rider' });
    try {
      await Rider.create({ user: user._id, fullName: name, phone, nationalId, licenseNumber, stage, district, status: 'Pending' });
    } catch (e) { await User.findByIdAndDelete(user._id); throw e; }
    res.render('auth/registered', { title: 'Application received' });
  } catch (error) { if (error.code === 11000) return res.status(409).render('auth/register', { title: 'Rider registration', error: 'That email or account is already registered.' }); next(error); }
};
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email || '').trim().toLowerCase(), active: true }).select('+password');
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).render('auth/login', { title: 'Sign in', error: 'Email or password is incorrect.' });
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      const destination = user.role === 'admin' ? '/admin' : '/account';
      req.session.save((saveErr) => { if (saveErr) return next(saveErr); res.redirect(destination); });
    });
  } catch (error) { next(error); }
};
exports.logout = (req, res, next) => req.session.destroy((err) => { if (err) return next(err); res.clearCookie('boda.sid'); res.redirect('/'); });
