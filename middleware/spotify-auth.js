const Provider = require('../models/Provider');

const SpotifyStrategy = require('passport-spotify').Strategy;

module.exports = (passport) => {

    const filter = {
        'name' : 'spotify'
    };

    Provider.findOne(filter).then((provider) => {

        if(provider) {
            const parameters = {
                clientID: provider.clientId,
                clientSecret: provider.clientSecret,
                callbackURL: provider.callbackUrl
            };
            const strategy = new SpotifyStrategy(parameters,
                (token, refreshToken, profile, done) => done(null, {profile, token, refreshToken}));

            passport.serializeUser((user, done) => done(null, user));
            passport.deserializeUser((user, done) => done(null, user));
            passport.use(strategy);
        }
    });
};
