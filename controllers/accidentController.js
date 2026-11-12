const Accident = require('../models/Accident');
const Rider = require('../models/Rider');
const Motorcycle = require('../models/Motorcycle');

exports.list = async (req, res, next) => {
  try {
    const accidents = await Accident.find()
      .populate('rider', 'fullName')
      .populate('motorcycle', 'registrationNumber')
      .sort({ accidentDate: -1 });
    res.render('accidents/index', { title: 'Accident reports', accidents });
  } catch (error) { next(error); }
};

exports.newForm = async (req, res, next) => {
  try {
    const [riders, motorcycles] = await Promise.all([
      Rider.find().sort({ fullName: 1 }),
      Motorcycle.find().sort({ registrationNumber: 1 })
    ]);
    res.render('accidents/new', { title: 'Record accident', riders, motorcycles });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    await Accident.create({
      rider: req.body.rider,
      motorcycle: req.body.motorcycle || undefined,
      accidentDate: req.body.accidentDate,
      locationName: req.body.locationName,
      district: req.body.district,
      severity: req.body.severity,
      description: req.body.description,
      latitude: req.body.latitude === '' ? undefined : req.body.latitude,
      longitude: req.body.longitude === '' ? undefined : req.body.longitude
    });
    res.redirect('/accidents');
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).send(`Please check the form: ${error.message}`);
    }
    next(error);
  }
};

exports.map = async (req, res, next) => {
  try {
    const accidents = await Accident.find({
      latitude: { $exists: true, $ne: null },
      longitude: { $exists: true, $ne: null }
    }).populate('rider', 'fullName');
    res.render('accidents/map', {
      title: 'Accident map',
      mapPoints: accidents.map((a) => ({
        latitude: a.latitude,
        longitude: a.longitude,
        locationName: a.locationName,
        severity: a.severity,
        riderName: a.rider ? a.rider.fullName : 'Unknown rider',
        date: a.accidentDate.toISOString().slice(0, 10)
      }))
    });
  } catch (error) { next(error); }
};
