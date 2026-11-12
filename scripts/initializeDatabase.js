
require('dotenv').config();

const mongoose = require('mongoose');

const User = require('../models/User');
const Rider = require('../models/Rider');
const Motorcycle = require('../models/Motorcycle');
const Accident = require('../models/Accident');

async function initializeDatabase() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from .env');
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log('Connected to the new database.');

        // Create collections and their schema indexes.
        await User.init();
        await Rider.init();
        await Motorcycle.init();
        await Accident.init();

        // Create the sessions collection if it does not exist.
        const sessionCollectionExists =
            await mongoose.connection.db
                .listCollections({ name: 'sessions' })
                .hasNext();

        if (!sessionCollectionExists) {
            await mongoose.connection.db.createCollection('sessions');
        }

        console.log('Database initialization completed.');

        console.log('Collections created:');
        console.log('- users');
        console.log('- riders');
        console.log('- motorcycles');
        console.log('- accidents');
        console.log('- sessions');

    } catch (error) {
        console.error('Database initialization failed:', error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
}

initializeDatabase();
