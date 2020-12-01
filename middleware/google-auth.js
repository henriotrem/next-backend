const googleConfig = require('../configuration/google-config.js');

const GoogleOAuthStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  passport.use(new GoogleOAuthStrategy(
      {
        clientID: googleConfig.oAuthClientID,
        clientSecret: googleConfig.oAuthClientSecret,
        callbackURL: googleConfig.oAuthCallbackUrl
      },
      (token, refreshToken, profile, done) => {
          done(null, {profile, token, refreshToken})
      }));
};
