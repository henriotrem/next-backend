const express = require('express');
const router = express.Router();

const photoController = require('../controllers/photo');
const auth = require('../middleware/auth');

router.post('/', auth, photoController.addPhotos);
router.put('/:photoId', auth, photoController.updatePhoto);
router.patch('/:photoId', auth, photoController.patchPhoto);
router.patch('/', auth, photoController.patchPhotos);
router.delete('/:photoId', auth, photoController.deletePhoto);
router.delete('/', auth, photoController.deletePhotos);
router.get('/:photoId', auth, photoController.getPhoto);
router.get('/', auth, photoController.getPhotos);
router.head('/', auth, photoController.countPhotos);

module.exports = router;
