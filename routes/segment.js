const express = require('express');
const router = express.Router();

const segmentController = require('../controllers/segment');
const auth = require('../middleware/auth');

router.post('/', auth, segmentController.createSegments);
router.get('/:ids', auth, segmentController.getSegments);
router.get('/', auth, segmentController.getAllSegments);

module.exports = router;
