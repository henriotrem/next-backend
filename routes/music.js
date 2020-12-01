const express = require('express');
const router = express.Router();

const musicController = require('../controllers/music');
const auth = require('../middleware/auth');

router.post('/', auth, musicController.addMusics);
router.put('/', auth, musicController.updateMusics);
router.delete('/', auth, musicController.deleteMusics);
router.get('/', auth, musicController.getMusics);

module.exports = router;
