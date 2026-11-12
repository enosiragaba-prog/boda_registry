const Motorcycle = require('../models/Motorcycle');
const Rider = require('../models/Rider');

exports.list = async (req, res, next) => {
  try {
    const motorcycles = await Motorcycle.find().populate('rider', 'fullName').sort({ createdAt: -1 });
    res.render('motorcycles/index', { title: 'Motorcycles', motorcycles });
  } catch (error) { next(error); }
};

exports.newForm = async (req, res, next) => {
  try {
    const riders = await Rider.find({ status: 'Active' }).sort({ fullName: 1 });
    res.render('motorcycles/new', { title: 'Register motorcycle', riders });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    await Motorcycle.create({
      registrationNumber: req.body.registrationNumber,
      make: req.body.make,
      model: req.body.model,
      color: req.body.color,
      year: req.body.year || undefined,
      rider: req.body.rider || undefined
    });
    res.redirect('/motorcycles');
  } catch (error) {
    if (error.code === 11000) return res.status(400).send('That motorcycle registration number is already registered.');
    if (error.name === 'ValidationError') return res.status(400).send(`Please check the form: ${error.message}`);
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const motorcycle = await Motorcycle.findById(req.params.id);
    if (!motorcycle) return res.status(404).send('Motorcycle not found');

    const Accident = require('../models/Accident');
    const hasAccidents = await Accident.exists({ motorcycle: motorcycle._id });
    if (hasAccidents) return res.status(400).send('This motorcycle has accident records and cannot be deleted.');

    await motorcycle.deleteOne();
    res.redirect('/motorcycles');
  } catch (error) { next(error); }
};
