const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.list);
router.get('/new', productController.newForm);
router.post('/new', productController.create);
router.get('/:id/edit', productController.editForm);
router.post('/:id/edit', productController.update);
router.post('/:id/delete', productController.remove);

module.exports = router;
