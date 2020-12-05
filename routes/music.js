const express = require('express');
const router = express.Router();

const musicController = require('../controllers/music');
const auth = require('../middleware/auth');

router.post('/', auth, musicController.addMusics);
router.put('/:musicId', auth, musicController.updateMusic);
router.patch('/:musicId', auth, musicController.patchMusic);
router.patch('/', auth, musicController.patchMusics);
router.delete('/:musicId', auth, musicController.deleteMusic);
router.delete('/', auth, musicController.deleteMusics);
router.get('/:musicId', auth, musicController.getMusic);
router.get('/', auth, musicController.getMusics);
router.head('/', auth, musicController.countMusics);

module.exports = router;
