const express = require('express');
const router = express.Router();

const positionController = require('../controllers/position');
const auth = require('../middleware/auth');

router.post('/', auth, positionController.addPositions);
router.put('/:positionId', auth, positionController.updatePosition);
router.patch('/:positionId', auth, positionController.patchPosition);
router.patch('/', auth, positionController.patchPositions);
router.delete('/:positionId', auth, positionController.deletePosition);
router.delete('/', auth, positionController.deletePositions);
router.get('/:positionId', auth, positionController.getPosition);
router.get('/', auth, positionController.getPositions);
router.head('/', auth, positionController.countPositions);

module.exports = router;
