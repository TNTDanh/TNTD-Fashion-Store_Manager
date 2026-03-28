const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/', salesController.list);
router.get('/new', salesController.newForm);
router.post('/new', salesController.create);
router.get('/:id', salesController.detail);

module.exports = router;
