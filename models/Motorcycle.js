const mongoose = require('mongoose');

const motorcycleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
  make: { type: String, trim: true },
  model: { type: String, trim: true },
  color: { type: String, trim: true },
  year: { type: Number, min: 1950, max: 2100 },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Motorcycle', motorcycleSchema);
