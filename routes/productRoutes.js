const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireRole } = require('../middleware/auth');

router.get('/', requireRole(['admin', 'staff']), productController.list);
router.get('/new', requireRole(['admin']), productController.newForm);
router.post('/new', requireRole(['admin']), productController.create);
router.get('/:id/edit', requireRole(['admin']), productController.editForm);
router.post('/:id/edit', requireRole(['admin']), productController.update);
router.post('/:id/delete', requireRole(['admin']), productController.remove);

module.exports = router;
