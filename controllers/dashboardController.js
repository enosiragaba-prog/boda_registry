const Rider = require('../models/Rider');
const Motorcycle = require('../models/Motorcycle');
const Accident = require('../models/Accident');

exports.showDashboard = async (req, res, next) => {
  try {
    const [riders, motorcycles, accidents, recentAccidents] = await Promise.all([
      Rider.countDocuments(),
      Motorcycle.countDocuments(),
      Accident.countDocuments(),
      Accident.find().populate('rider', 'fullName').sort({ accidentDate: -1 }).limit(5)
    ]);

    res.render('dashboard', {
      title: 'Dashboard',
      stats: { riders, motorcycles, accidents },
      recentAccidents
    });
  } catch (error) {
    next(error);
  }
};
