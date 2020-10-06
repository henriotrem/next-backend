const express = require('express');
const router = express.Router();

const photoController = require('../controllers/photo');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, photoController.addPhoto);
router.put('/:id', auth, multer, photoController.updatePhoto);
router.delete('/:id', auth, photoController.deletePhoto);
router.get('/:ids', auth, photoController.getPhotos);
router.get('/', auth, photoController.getAllPhotos);

module.exports = router;
