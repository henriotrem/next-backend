const express = require('express');
const router = express.Router();

const universeController = require('../controllers/universe');
const auth = require('../middleware/auth');

router.post('/', auth, universeController.addUniverses);
router.put('/', auth, universeController.updateUniverses);
router.delete('/', auth, universeController.deleteUniverses);
router.get('/', auth, universeController.getUniverses);

router.post('/:key/element', auth, universeController.addElement);
router.get('/:key/indexes/:ids', auth, universeController.getIndexes);
router.get('/:key/lists/:ids', auth, universeController.getLists);
router.post('/:key/randomize', auth, universeController.addRandomElements);


module.exports = router;
