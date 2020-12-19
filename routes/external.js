const express = require('express');
const router = express.Router();

const externalController = require('../controllers/external');
const auth = require('../middleware/auth');

router.get('/:type/context', auth, externalController.getContext);
router.get('/:type/data', auth, externalController.getData);

module.exports = router;
