const express = require('express');
const router = express.Router();

const positionController = require('../controllers/position');
const auth = require('../middleware/auth');

router.post('/', auth, positionController.addPositions);
router.put('/', auth, positionController.updatePositions);
router.delete('/', auth, positionController.deletePositions);
router.get('/', auth, positionController.getPositions);

module.exports = router;
