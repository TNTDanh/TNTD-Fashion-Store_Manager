const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.list);
router.post('/new', supplierController.create);
router.post('/:id/edit', supplierController.update);
router.post('/:id/delete', supplierController.remove);

module.exports = router;
