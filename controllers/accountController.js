const Rider = require('../models/Rider');
exports.show = async (req, res, next) => {
  try {
    const rider = await Rider.findOne({ user: req.session.user.id });
    if (!rider) return res.status(404).render('error', { title: 'Profile not found', message: 'No rider profile is linked to this account. Contact the administrator.' });
    res.render('account/index', { title: 'My rider profile', rider, message: null });
  } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try {
    const rider = await Rider.findOne({ user: req.session.user.id });
    if (!rider) return res.status(404).send('Rider profile not found.');
    // Identity/verification fields are intentionally not editable by the rider.
    rider.phone = req.body.phone || rider.phone;
    rider.stage = req.body.stage || '';
    rider.district = req.body.district || '';
    rider.publicName = req.body.publicName === 'on';
    await rider.save();
    res.render('account/index', { title: 'My rider profile', rider, message: 'Your profile has been updated.' });
  } catch (e) { next(e); }
};
