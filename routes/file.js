const express = require('express');
const router = express.Router();

const fileController = require('../controllers/file');
const auth = require('../middleware/auth');

router.post('/', auth, fileController.addFile);
router.put('/:signature', auth, fileController.updateFile);
router.get('/:signatures', auth, fileController.getFiles);
router.get('/', auth, fileController.getAllFiles);

module.exports = router;
