const mongoose = require('mongoose');
const riderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true },
  nationalId: { type: String, trim: true, select: false },
  licenseNumber: { type: String, trim: true, select: false },
  stage: { type: String, trim: true },
  district: { type: String, trim: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Pending', 'Rejected', 'Suspended'], default: 'Pending' },
  publicName: { type: Boolean, default: false },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Rider', riderSchema);
