const router = require('express').Router();
const controller = require('../controllers/motorcycleController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
router.use(isLoggedIn, isAdmin);
router.get('/', controller.list);
router.get('/new', controller.newForm);
router.post('/', controller.create);
router.post('/:id/delete', controller.remove);
module.exports = router;
