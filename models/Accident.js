const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true },
  motorcycle: { type: mongoose.Schema.Types.ObjectId, ref: 'Motorcycle' },
  accidentDate: { type: Date, required: true },
  locationName: { type: String, required: true, trim: true },
  district: { type: String, trim: true },
  severity: { type: String, enum: ['Minor', 'Serious', 'Fatal'], required: true },
  description: { type: String, trim: true },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 }
}, { timestamps: true });

module.exports = mongoose.model('Accident', accidentSchema);
