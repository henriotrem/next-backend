const express = require('express');
const router = express.Router();

const externalController = require('../controllers/external');
const auth = require('../middleware/auth');

const passport = require('passport');
const googleConfig = require('../configuration/google-config.js');
const spotifyConfig = require('../configuration/spotify-config.js');

router.get('/google', (req, res) => {

    passport.authenticate('google', {
        scope: googleConfig.scopes,
        accessType: 'offline',
        prompt: 'consent',
        failureFlash: true,  // Display errors to the user.
        session: true,
        state:req.query.userId
    })(req,res)
});
router.get('/google/callback',
    passport.authenticate(
        'google', {failureRedirect: '/', failureFlash: true, session: true}),
    externalController.saveToken);
router.get('/google/photos', auth, externalController.getGooglePhotos);

router.get('/spotify', (req, res) => {

    passport.authenticate('spotify', {
        scope: spotifyConfig.scopes,
        accessType: 'offline',
        prompt: 'consent',
        failureFlash: true,  // Display errors to the user.
        session: true,
        state:req.query.userId
    })(req,res)
});
router.get('/spotify/callback',
    passport.authenticate(
        'spotify', {failureRedirect: '/', failureFlash: true, session: true}),
    externalController.saveToken);
router.get('/spotify/track', auth, externalController.getSpotifyTrack);

module.exports = router;
