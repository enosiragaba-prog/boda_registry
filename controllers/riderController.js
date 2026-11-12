const Rider = require('../models/Rider');
const Motorcycle = require('../models/Motorcycle');
const Accident = require('../models/Accident');

exports.list = async (req, res, next) => {
  try {
    const riders = await Rider.find().sort({ createdAt: -1 });
    res.render('riders/index', { title: 'Riders', riders });
  } catch (error) { next(error); }
};

exports.newForm = (req, res) => {
  res.render('riders/new', { title: 'Register rider' });
};

exports.create = async (req, res, next) => {
  try {
    await Rider.create({
      fullName: req.body.fullName,
      phone: req.body.phone,
      nationalId: req.body.nationalId,
      licenseNumber: req.body.licenseNumber,
      stage: req.body.stage,
      district: req.body.district
    });
    res.redirect('/riders');
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send(`Please check the form: ${error.message}`);
    }
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).send('Rider not found');

    const hasMotorcycles = await Motorcycle.exists({ rider: rider._id });
    const hasAccidents = await Accident.exists({ rider: rider._id });
    if (hasMotorcycles || hasAccidents) {
      return res.status(400).send('This rider has linked records. Mark the rider inactive instead of deleting them.');
    }

    await rider.deleteOne();
    res.redirect('/riders');
  } catch (error) { next(error); }
};
