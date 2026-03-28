const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole(['admin', 'staff']), variantController.list);
router.get('/new', requireRole(['admin']), variantController.newForm);
router.post('/new', requireRole(['admin']), variantController.create);
router.get('/:id/edit', requireRole(['admin']), variantController.editForm);
router.post('/:id/edit', requireRole(['admin']), variantController.update);
router.post('/:id/delete', requireRole(['admin']), variantController.remove);

module.exports = router;
