const express = require('express');
const router = express.Router();

const segmentController = require('../controllers/segment');
const auth = require('../middleware/auth');


router.post('/', auth, segmentController.addSegments);
router.put('/:segmentId', auth, segmentController.updateSegment);
router.patch('/:segmentId', auth, segmentController.patchSegment);
router.patch('/', auth, segmentController.patchSegments);
router.delete('/:segmentId', auth, segmentController.deleteSegment);
router.delete('/', auth, segmentController.deleteSegments);
router.get('/:segmentId', auth, segmentController.getSegment);
router.get('/', auth, segmentController.getSegments);
router.head('/', auth, segmentController.countSegments);

module.exports = router;
