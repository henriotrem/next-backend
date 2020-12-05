const express = require('express');
const router = express.Router();

const watchController = require('../controllers/watch');
const auth = require('../middleware/auth');

router.post('/', auth, watchController.addWatches);
router.put('/:watchId', auth, watchController.updateWatch);
router.patch('/:watchId', auth, watchController.patchWatch);
router.patch('/', auth, watchController.patchWatches);
router.delete('/:watchId', auth, watchController.deleteWatch);
router.delete('/', auth, watchController.deleteWatches);
router.get('/:watchId', auth, watchController.getWatch);
router.get('/', auth, watchController.getWatches);
router.head('/', auth, watchController.countWatches);

module.exports = router;
