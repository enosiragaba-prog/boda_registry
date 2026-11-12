require('dotenv').config();
const mongoose = require('mongoose');
const Rider = require('../models/Rider');
(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from .env');
    await mongoose.connect(process.env.MONGO_URI);
    // Keep every existing record. Existing Active/Inactive values remain unchanged.
    // Records with no status are marked Active to preserve the current public registry behaviour.
    const result = await Rider.updateMany({ $or: [{ status: { $exists: false } }, { status: null }] }, { $set: { status: 'Active', publicName: false } });
    await Rider.updateMany({ publicName: { $exists: false } }, { $set: { publicName: false } });
    console.log(`Migration complete. Updated ${result.modifiedCount} riders with a missing status.`);
    console.log('Existing riders, motorcycles and accident records were not deleted. Existing riders are not automatically linked to login accounts.');
  } catch (e) { console.error(e.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();
