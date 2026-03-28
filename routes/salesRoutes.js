const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole(['admin', 'staff']), salesController.list);
router.get('/new', requireRole(['admin', 'staff']), salesController.newForm);
router.post('/new', requireRole(['admin', 'staff']), salesController.create);
router.get('/:id', requireRole(['admin', 'staff']), salesController.detail);

module.exports = router;
