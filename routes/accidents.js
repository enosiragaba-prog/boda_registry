const router = require('express').Router();
const controller = require('../controllers/accidentController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
router.use(isLoggedIn, isAdmin);
router.get('/', controller.list);
router.get('/new', controller.newForm);
router.post('/', controller.create);
router.get('/map', controller.map);
module.exports = router;
