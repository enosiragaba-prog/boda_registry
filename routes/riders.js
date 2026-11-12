const router = require('express').Router();
const controller = require('../controllers/riderController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');
router.use(isLoggedIn, isAdmin);
router.get('/', controller.list);
router.get('/new', (req, res) => res.redirect('/admin/riders/new'));
router.post('/', (req, res) => res.redirect(307, '/admin/riders'));
router.post('/:id/delete', controller.remove);
module.exports = router;
