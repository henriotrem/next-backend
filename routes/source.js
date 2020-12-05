const express = require('express');
const router = express.Router();

const sourceController = require('../controllers/source');
const fileController = require('../controllers/file');
const apiController = require('../controllers/api');
const auth = require('../middleware/auth');

router.post('/', auth, sourceController.addSources);
router.put('/:sourceId', auth, sourceController.updateSource);
router.patch('/:sourceId', auth, sourceController.patchSource);
router.patch('/', auth, sourceController.patchSources);
router.delete('/:sourceId', auth, sourceController.deleteSource);
router.delete('/', auth, sourceController.deleteSources);
router.get('/:sourceId', auth, sourceController.getSource);
router.get('/', auth, sourceController.getSources);
router.head('/', auth, sourceController.countSources);

router.post('/:sourceId/files', auth, fileController.addFiles);
router.put('/:sourceId/files/:fileId', auth, fileController.updateFile);
router.patch('/:sourceId/files/:fileId', auth, fileController.patchFile);
router.patch('/:sourceId/files', auth, fileController.patchFiles);
router.delete('/:sourceId/files/:fileId', auth, fileController.deleteFile);
router.delete('/:sourceId/files', auth, fileController.deleteFiles);
router.get('/:sourceId/files/:fileId', auth, fileController.getFile);
router.get('/:sourceId/files', auth, fileController.getFiles);
router.head('/:sourceId/files', auth, fileController.countFiles);
router.patch('/:sourceId/files/:fileId/processed', auth, fileController.patchFileProcessed);

router.post('/:sourceId/apis', auth, apiController.addApis);
router.put('/:sourceId/apis/:apiId', auth, apiController.updateApi);
router.patch('/:sourceId/apis/:apiId', auth, apiController.patchApi);
router.patch('/:sourceId/apis', auth, apiController.patchApis);
router.delete('/:sourceId/apis/:apiId', auth, apiController.deleteApi);
router.delete('/:sourceId/apis', auth, apiController.deleteApis);
router.get('/:sourceId/apis/:apiId', auth, apiController.getApi);
router.get('/:sourceId/apis', auth, apiController.getApis);
router.head('/:sourceId/apis', auth, apiController.countApis);

module.exports = router;
