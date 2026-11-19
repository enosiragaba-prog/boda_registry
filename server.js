require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStoreModule = require('connect-mongo');
const MongoStore = MongoStoreModule.default || MongoStoreModule;
const helmet = require('helmet');
const connectDB = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;
if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Add it to your .env file.');
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) throw new Error('SESSION_SECRET must be set in production.');
app.disable('x-powered-by');
app.use(helmet({
    contentSecurityPolicy: false,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
}));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
  name: 'boda.sid', secret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
  resave: false, saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: 'sessions', ttl: 60 * 60 * 8 }),
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 }
}));
app.use((req, res, next) => { res.locals.currentUser = req.session.user || null; next(); });
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/account', require('./routes/account'));
app.use('/admin', require('./routes/admin'));
app.use('/riders', require('./routes/riders'));
app.use('/motorcycles', require('./routes/motorcycles'));
app.use('/accidents', require('./routes/accidents'));
app.use((req, res) => res.status(404).render('404', { title: 'Page not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).render('error', { title: 'Something went wrong', message: 'The request could not be completed. Please try again.' }); });
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Could not start application:', error.message);
        process.exit(1);
    });