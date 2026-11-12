const Rider = require('../models/Rider');
const User = require('../models/User');
const Motorcycle = require('../models/Motorcycle');
const Accident = require('../models/Accident');
exports.dashboard = async (req, res, next) => {
  try {
    const [riders, pending, motorcycles, accidents, recent] = await Promise.all([
      Rider.countDocuments({ status: 'Active' }), Rider.countDocuments({ status: 'Pending' }), Motorcycle.countDocuments(), Accident.countDocuments(),
      Accident.find().populate('rider', 'fullName').sort({ accidentDate: -1 }).limit(6)
    ]);
    res.render('admin/dashboard', { title: 'Administration', stats: { riders, pending, motorcycles, accidents }, recent });
  } catch (e) { next(e); }
};
exports.pending = async (req, res, next) => { try { const riders = await Rider.find({ status: 'Pending' }).select('+nationalId +licenseNumber').sort({ createdAt: 1 }); res.render('admin/pending', { title: 'Registration approvals', riders }); } catch (e) { next(e); } };
exports.review = async (req, res, next) => {
  try {
    const status = req.body.status;
    if (!['Active', 'Rejected', 'Suspended'].includes(status)) return res.status(400).send('Invalid review decision.');
    const rider = await Rider.findByIdAndUpdate(req.params.id, { status, reviewedAt: new Date(), reviewedBy: req.session.user.id }, { new: true });
    if (!rider) return res.status(404).send('Rider not found.');
    res.redirect('/admin/approvals');
  } catch (e) { next(e); }
};
exports.addRiderForm = (req, res) => res.render('riders/new', { title: 'Add rider' });
exports.addRider = async (req, res, next) => {
  try { await Rider.create({ fullName: req.body.fullName, phone: req.body.phone, nationalId: req.body.nationalId, licenseNumber: req.body.licenseNumber, stage: req.body.stage, district: req.body.district, status: 'Active' }); res.redirect('/riders'); }
  catch (e) { if (e.name === 'ValidationError') return res.status(400).send(e.message); next(e); }
};
exports.users = async (req, res, next) => { try { const users = await User.find().select('name email role active createdAt').sort({ createdAt: -1 }); res.render('admin/users', { title: 'User accounts', users }); } catch (e) { next(e); } };
