const express = require('express');
const router = express.Router();

const positionController = require('../controllers/position');
const auth = require('../middleware/auth');

router.post('/', auth, positionController.addPosition);
router.put('/:id', auth, positionController.updatePosition);
router.put('/', auth, positionController.updatePositions);
router.delete('/:id', auth, positionController.deletePosition);
router.get('/:ids', auth, positionController.getPositions);
router.get('/', auth, positionController.getAllPositions);

module.exports = router;
