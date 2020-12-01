const spotifyConfig = require('../configuration/spotify-config.js');

const SpotifyStrategy = require('passport-spotify').Strategy;

module.exports = (passport) => {
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    passport.use(
        new SpotifyStrategy(
            {
                clientID: spotifyConfig.oAuthClientID,
                clientSecret: spotifyConfig.oAuthClientSecret,
                callbackURL: spotifyConfig.oAuthCallbackUrl,
            },
            (token, refreshToken, profile, done) => {
                done(null, {profile, token, refreshToken})
            }));
};
