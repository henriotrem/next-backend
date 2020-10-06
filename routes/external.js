const express = require('express');
const router = express.Router();

const externalController = require('../controllers/external');
const auth = require('../middleware/auth');

const passport = require('passport');
const googleConfig = require('../conf/google-config.js');

router.get('/google', (req, res) => {

    passport.authenticate('google', {
        scope: googleConfig.scopes,
        failureFlash: true,  // Display errors to the user.
        session: true,
        state:req.query.userId
    })(req,res)
});
router.get('/google/callback',
    passport.authenticate(
        'google', {failureRedirect: '/', failureFlash: true, session: true}),
    externalController.saveGoogleToken);
router.get('/google/photos', auth, externalController.getPhotos);

module.exports = router;
