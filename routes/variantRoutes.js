const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');

router.get('/', variantController.list);
router.get('/new', variantController.newForm);
router.post('/new', variantController.create);
router.get('/:id/edit', variantController.editForm);
router.post('/:id/edit', variantController.update);
router.post('/:id/delete', variantController.remove);

module.exports = router;
