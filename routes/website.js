const express = require('express');
const router = express.Router();

const websiteController = require('../controllers/website');
const auth = require('../middleware/auth');

router.post('/', auth, websiteController.addWebsites);
router.put('/', auth, websiteController.updateWebsites);
router.delete('/', auth, websiteController.deleteWebsites);
router.get('/', auth, websiteController.getWebsites);

module.exports = router;
