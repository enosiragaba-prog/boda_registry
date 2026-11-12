require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
(async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.ADMIN_NAME || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error('Set MONGO_URI, ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
    if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters long.');
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) { console.log('An account with that email already exists. No changes made.'); return; }
    await User.create({ name: process.env.ADMIN_NAME, email, password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: 'admin' });
    console.log('Administrator account created. Sign in at /auth/login.');
  } catch (e) { console.error(e.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();
