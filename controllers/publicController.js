const Rider = require('../models/Rider');
const Accident = require('../models/Accident');
exports.home = async (req, res, next) => {
  try {
    const [riders, accidents, districts] = await Promise.all([
      Rider.countDocuments({ status: 'Active' }), Accident.countDocuments(),
      Accident.aggregate([{ $group: { _id: '$district', total: { $sum: 1 } } }, { $sort: { total: -1 } }, { $limit: 6 }])
    ]);
    res.render('public/home', { title: 'Public registry', stats: { riders, accidents }, districts });
  } catch (e) { next(e); }
};
exports.riders = async (req, res, next) => {
  try {
    const search = String(req.query.q || '').trim();
    const filter = { status: 'Active' };
    if (search) filter.$or = [{ stage: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }, { district: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }];
    const riders = await Rider.find(filter).select('fullName publicName stage district status createdAt').sort({ fullName: 1 }).limit(100);
    res.render('public/riders', { title: 'Registered riders', riders, search });
  } catch (e) { next(e); }
};
exports.stats = async (req, res, next) => {
  try {
    const [total, bySeverity, byDistrict, byMonth] = await Promise.all([
      Accident.countDocuments(),
      Accident.aggregate([{ $group: { _id: '$severity', total: { $sum: 1 } } }, { $sort: { total: -1 } }]),
      Accident.aggregate([{ $group: { _id: { $ifNull: ['$district', 'Not specified'] }, total: { $sum: 1 } } }, { $sort: { total: -1 } }, { $limit: 10 }]),
      Accident.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m', date: '$accidentDate' } }, total: { $sum: 1 } } }, { $sort: { _id: 1 } }, { $limit: 12 }])
    ]);
    res.render('public/stats', { title: 'Accident statistics', total, bySeverity, byDistrict, byMonth });
  } catch (e) { next(e); }
};
