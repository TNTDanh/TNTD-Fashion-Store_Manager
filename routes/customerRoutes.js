const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.list);
router.post('/new', customerController.create);
router.post('/:id/edit', customerController.update);
router.post('/:id/delete', customerController.remove);

module.exports = router;
