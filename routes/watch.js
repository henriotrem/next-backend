const express = require('express');
const router = express.Router();

const watchController = require('../controllers/watch');
const auth = require('../middleware/auth');

router.post('/', auth, watchController.addWatches);
router.put('/', auth, watchController.updateWatches);
router.delete('/', auth, watchController.deleteWatches);
router.get('/', auth, watchController.getWatches);

module.exports = router;
