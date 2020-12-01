const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.get('/account', auth, authController.getAccount);

module.exports = router;
