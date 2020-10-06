const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/service');
const auth = require('../middleware/auth');


router.get('/', auth, serviceController.getAllServices);
router.get('/:ids', auth, serviceController.getServices);
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;
