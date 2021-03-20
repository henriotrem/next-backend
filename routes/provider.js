const express = require('express');
const router = express.Router();

const providerController = require('../controllers/provider');
const auth = require('../middleware/auth');

router.post('/', auth, providerController.addProviders);
router.put('/:providerId', auth, providerController.updateProvider);
router.patch('/:providerId', auth, providerController.patchProvider);
router.patch('/', auth, providerController.patchProviders);
router.delete('/:providerId', auth, providerController.deleteProvider);
router.delete('/', auth, providerController.deleteProviders);
router.get('/:providerId', auth, providerController.getProvider);
router.get('/', auth, providerController.getProviders);
router.head('/', auth, providerController.countProviders);

router.get('/:providerId/oauth2', providerController.authenticate);
router.get('/:providerId/callback', providerController.saveToken);

module.exports = router;
