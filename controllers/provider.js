const request = require('request-promise');
const passport = require('passport');

const Provider = require('../models/Provider');
const Api = require('../models/Api');


exports.addProviders = (req, res) => {

    const providers = req.body.providers.map(obj=> ({ ...obj, userId: req.params.userId}));

    Provider.insertMany(providers, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({providers: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({providers: full})
            }
        })
        .catch((error) => {
                if (error.code === 11000) {
                    const insertedIds  = error.result.result.insertedIds.filter(
                        (element1) => error.writeErrors.filter(
                            (element2) => element2.index === element1.index).length === 0);

                    res.status(200).json(insertedIds);
                } else {
                    res.status(400).json(error);
                }
            }
        );
};

exports.updateProvider = (req, res) => {

    const filter = {
        '_id' :  req.params.providerId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Provider.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchProvider = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.providerId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Provider.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchProviders = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Provider.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteProvider = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.providerId
    };

    Provider.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteProviders = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Provider.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getProvider = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.providerId
    };

    Provider.findOne(filter)
        .then((provider) => res.status(200).json(provider))
        .catch(error => res.status(400).json(error));
};

exports.getProviders = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Provider.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({providers: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countProviders = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Provider.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};

exports.authenticate = (req, res, next) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.providerId
    };

    Provider.findOne(filter)
        .then((provider) => {
    
        passport.authenticate(provider.name, {
            scope: provider.scope,
            accessType: 'offline',
            prompt: 'consent',
            failureFlash: true,  // Display errors to the user.
            session: true,
            state:req.query.origin
        });
    })
    .catch(error => res.status(400).json(error));
}

exports.saveToken = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.providerId
    };

    Provider.findOne(filter)
        .then((provider) => {

            passport.authenticate(provider.name, {
                failureRedirect: '/',
                failureFlash: true,
                session: true
            });

            const origin = req.query.state.split('-');
            const api = {
                'userId' : origin[0],
                'providerId' : origin[1],
                'email' : req.user.profile.emails[0].value,
                'token' : req.user.token,
                'refreshToken' : req.user.refreshToken
            }

            Api.create(api)
                .then(() => res.send('<script>window.close();</script >'))
                .catch((reject=> {
                    console.log(reject);
                    res.status(403).send();
                }));
        })
        .catch(error => res.status(400).json(error));

}

exports.refreshToken = async (source, api) => {

    const provider = await Provider.findOne({ _id: source.providerId });
    const options = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        form: {
            client_id: provider.clientId,
            client_secret: provider.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: api.refreshToken,
        }
    };

    const result = JSON.parse(await request.post(provider.endpoint + '/token', options));
    await Api.findOneAndUpdate({_id: api.id},{'$set':{'token': result.access_token}});

    return result.access_token;
}
