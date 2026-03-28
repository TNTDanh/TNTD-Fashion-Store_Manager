const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole(['admin', 'staff']), categoryController.list);
router.post('/new', requireRole(['admin']), categoryController.create);
router.post('/:id/edit', requireRole(['admin']), categoryController.update);
router.post('/:id/delete', requireRole(['admin']), categoryController.remove);

module.exports = router;
