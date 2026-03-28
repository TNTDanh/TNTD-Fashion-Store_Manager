const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.list);
router.post('/new', categoryController.create);
router.post('/:id/edit', categoryController.update);
router.post('/:id/delete', categoryController.remove);

module.exports = router;
