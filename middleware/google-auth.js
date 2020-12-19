const Provider = require('../models/Provider');

const GoogleOAuthStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {

    const filter = {
        'name' : 'google'
    };

    Provider.findOne(filter).then((provider) => {

        if(provider) {
            const parameters = {
                clientID: provider.clientId,
                clientSecret: provider.clientSecret,
                callbackURL: provider.callbackUrl
            };
            const strategy = new GoogleOAuthStrategy(parameters,
                (token, refreshToken, profile, done) => done(null, {profile, token, refreshToken}));

            passport.serializeUser((user, done) => done(null, user));
            passport.deserializeUser((user, done) => done(null, user));
            passport.use(strategy);
        }
    });
};
