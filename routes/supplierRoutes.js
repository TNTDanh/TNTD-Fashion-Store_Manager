const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole(['admin']), supplierController.list);
router.post('/new', requireRole(['admin']), supplierController.create);
router.post('/:id/edit', requireRole(['admin']), supplierController.update);
router.post('/:id/delete', requireRole(['admin']), supplierController.remove);

module.exports = router;
