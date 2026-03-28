const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole(['admin', 'staff']), customerController.list);
router.post('/new', requireRole(['admin', 'staff']), customerController.create);
router.post('/:id/edit', requireRole(['admin', 'staff']), customerController.update);
router.post('/:id/delete', requireRole(['admin']), customerController.remove);

module.exports = router;
