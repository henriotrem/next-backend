const request = require('request-promise');
const googleConfig = require('../conf/google-config');

const Service = require('../models/Service');
const Photo = require('../models/Photo');

exports.saveGoogleToken = (req, res) => {

    Service.findOneAndUpdate({userId: req.query.state, name:'google'}, {
        userId : req.query.state,
        name : 'google',
        scopes : req.query.scope.split(' '),
        token: req.user.token
    },{ upsert : true, setDefaultsOnInsert: true, useFindAndModify: false}).catch((reject=>console.log(reject)));


    res.send('<script>window.close();</script >');
}

exports.getPhotos = (req, res) => {

    Service.findOne({'userId': req.params.userId, 'name': 'google'}).then(
        (service) => {

            res.status(200).json({ message: 'Transfer in progress' })
            const filters = {contentFilter: {}, mediaTypeFilter: {mediaTypes: ['PHOTO']}};

            libraryApiSearch(req.params.userId, service.token, {filters});
        });
}

async function libraryApiSearch(userId, authToken, parameters) {
    let photos = [];
    let error = null;

    parameters.pageSize = googleConfig.searchPageSize;

    let result = [];
    let total = 0;

    try {

        do {

            result =
                await request.post(googleConfig.apiEndpoint + '/v1/mediaItems:search', {
                    headers: {'Content-Type': 'application/json'},
                    json: parameters,
                    auth: {'bearer': authToken},
                });

            const items = result && result.mediaItems ?
                result.mediaItems
                    .filter(x => x)
                    .filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
                [];

            parameters.pageToken = result.nextPageToken;

            for(let media of items) {

                let photo = {
                    userId: userId,
                    url: media.baseUrl,
                    filename: media.filename,
                    mimeType: media.mimeType,
                    metadata: {
                        width: media.mediaMetadata.width,
                        height: media.mediaMetadata.height,
                        photo: media.mediaMetadata.photo
                    },
                    temporality: (new Date(media.mediaMetadata.creationTime)).getTime()/1000
                };

                Photo.findOneAndUpdate({userId: userId, temporality: photo.temporality, filename: photo.filename},
                    photo,
                    { upsert : true, setDefaultsOnInsert: true, useFindAndModify: false}).catch((reject=>console.log(reject)));

            }

            total += items.length;

            console.log(total + ' ' + items[0].mediaMetadata.creationTime);

        } while (result.mediaItems.length > 0 && parameters.pageToken != null);

    } catch (err) {

        error = err.error.error ||
            {name: err.name, code: err.statusCode, message: err.message};

        console.log(error);
    }

    return {photos, parameters, error};
}
