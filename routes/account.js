const router = require('express').Router();
const c = require('../controllers/accountController');
const { isLoggedIn, isRider } = require('../middleware/auth');
router.get('/', isLoggedIn, isRider, c.show);
router.post('/profile', isLoggedIn, isRider, c.update);
module.exports = router;
