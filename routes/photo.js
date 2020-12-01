const express = require('express');
const router = express.Router();

const photoController = require('../controllers/photo');
const auth = require('../middleware/auth');

router.post('/', auth, photoController.addPhotos);
router.put('/', auth, photoController.updatePhotos);
router.delete('/', auth, photoController.deletePhotos);
router.get('/', auth, photoController.getPhotos);

module.exports = router;
