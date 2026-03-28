const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole(['admin']), purchaseController.list);
router.get('/new', requireRole(['admin']), purchaseController.newForm);
router.post('/new', requireRole(['admin']), purchaseController.create);
router.get('/:id', requireRole(['admin']), purchaseController.detail);

module.exports = router;
