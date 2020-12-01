const express = require('express');
const router = express.Router();

const sourceController = require('../controllers/source');
const auth = require('../middleware/auth');


router.post('/', auth, sourceController.addSources);
router.put('/', auth, sourceController.updateSources);
router.delete('/', auth, sourceController.deleteSources);
router.get('/', auth, sourceController.getSources);

router.post('/:id/file', auth, sourceController.addFile);
router.put('/:id/file', auth, sourceController.updateFile);

module.exports = router;
