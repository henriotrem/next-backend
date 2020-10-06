const express = require('express');
const router = express.Router();

const universeController = require('../controllers/universe');
const auth = require('../middleware/auth');

router.post('/', auth, universeController.addUniverse);
router.get('/', auth, universeController.getAllUniverses);
router.get('/:key', auth, universeController.getOneUniverse);
router.delete('/:key', auth, universeController.deleteUniverse);
router.post('/:key/element', auth, universeController.addElement);
router.post('/:key/randomize', auth, universeController.addRandomElements);
router.get('/:key/indexes/:ids', auth, universeController.getIndexes);
router.get('/:key/lists/:ids', auth, universeController.getLists);


module.exports = router;
