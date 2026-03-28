const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.get('/', purchaseController.list);
router.get('/new', purchaseController.newForm);
router.post('/new', purchaseController.create);
router.get('/:id', purchaseController.detail);

module.exports = router;
