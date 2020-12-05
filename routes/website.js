const express = require('express');
const router = express.Router();

const websiteController = require('../controllers/website');
const auth = require('../middleware/auth');

router.post('/', auth, websiteController.addWebsites);
router.put('/:websiteId', auth, websiteController.updateWebsite);
router.patch('/:websiteId', auth, websiteController.patchWebsite);
router.patch('/', auth, websiteController.patchWebsites);
router.delete('/:websiteId', auth, websiteController.deleteWebsite);
router.delete('/', auth, websiteController.deleteWebsites);
router.get('/:websiteId', auth, websiteController.getWebsite);
router.get('/', auth, websiteController.getWebsites);
router.head('/', auth, websiteController.countWebsites);

module.exports = router;
