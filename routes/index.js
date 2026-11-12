const router = require('express').Router();
const pub = require('../controllers/publicController');
router.get('/', pub.home);
router.get('/public/riders', pub.riders);
router.get('/public/accident-statistics', pub.stats);
module.exports = router;
