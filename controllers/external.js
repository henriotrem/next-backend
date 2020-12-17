const request = require('request-promise');
const googleConfig = require('../configuration/google-config');
const spotifyConfig = require('../configuration/spotify-config');

const Source = require('../models/Source');
const Api = require('../models/Api');

exports.saveToken = (req, res) => {

    const origin = req.query.state.split('-');
    const api = {
        'userId' : origin[0],
        'sourceId' : origin[1],
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
}

async function refreshToken(apiId, config, refreshToken, cb) {

    let forms = {
        client_id:config.oAuthClientID,
        client_secret:config.oAuthClientSecret,
        grant_type:'refresh_token',
        refresh_token:refreshToken,
    }

    let result =
        JSON.parse(await request.post(config.oAuthEnpoint + '/token', {
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            form: forms
        }));

    console.log('New token : ' + result.access_token);

    Api.findOneAndUpdate(
        { _id: apiId },
        { '$set' :
                {
                    'token' : result.access_token,
                }
        })
        .then(cb(result.access_token))
        .catch((reject=>console.log(reject)));
}

exports.getGooglePhotos = (req, res) => {

    Source.findOne({'userId': req.params.userId, 'provider': 'google'}).then((source) => {

        Api.findOne({'userId': req.params.userId, 'sourceId': source._id}).then((api) => {

            let minTime = new Date(+req.query.start*1000);
            const filters = {contentFilter: {}, mediaTypeFilter: {mediaTypes: ['PHOTO']}};

            filters.dateFilter = {
                ranges: [{
                    startDate: {
                        'year': minTime.getUTCFullYear(),
                        'month': minTime.getUTCMonth()+1,
                        'day': minTime.getUTCDate()
                    },
                    endDate: {
                        'year': minTime.getUTCFullYear(),
                        'month': minTime.getUTCMonth()+1,
                        'day': minTime.getUTCDate()
                    }
                }]
            };

            libraryGooglePhotoApiSearch(api.token, {filters}).then((result) => {

                if(result.error && result.error.code === 401) {

                    refreshToken(api._id, googleConfig, api.refreshToken, (token) => {

                        libraryGooglePhotoApiSearch(token, {filters}).then((result) => {

                            res.status(200).json({photos : result.photos});
                        });
                    });
                } else {

                    res.status(200).json({photos : result.photos});
                }
            });
        });
    });
}

async function libraryGooglePhotoApiSearch(authToken, parameters) {
    let photos = [];
    let error = null;

    parameters.pageSize = googleConfig.searchPageSize;

    let result = [];
    let total = 0;

    try {

        do {
            result =
                await request.post(googleConfig.photoApiEndpoint + '/v1/mediaItems:search', {
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

                photos.push(photo);
            }

            total += items.length;

        } while (result && result.mediaItems.length > 0 && parameters.pageToken != null);

    } catch (err) {

        error = err.error.error ||
            {name: err.name, code: err.statusCode, message: err.message};
    }

    return {photos, parameters, error};
}

exports.getSpotifyTrack = (req, res) => {

    Source.findOne({userId: req.params.userId, 'provider': 'spotify'}).then((source) => {

        Api.findOne({'userId': req.params.userId, 'sourceId': source._id}).then((api) => {

            librarySpotifyApiSearch(api.token, req.query.track, req.query.artist).then((result) => {

                if (result.error && result.error.code === 401) {

                    refreshToken(api._id, spotifyConfig, api.refreshToken, (token) => {

                        librarySpotifyApiSearch(api.token, req.query.track, req.query.artist).then((result) => {

                            res.status(200).json(result.tracks);
                        });
                    });
                } else {
                    res.status(200).json(result.tracks);
                }
            });
        });
    });
}

async function librarySpotifyApiSearch(authToken, track, artist) {

    let tracks = [];
    let error = null;

    try {
        const query = 'q=track:' + encodeURI(track) +  '%20artist:' + encodeURI(artist) + '&type=track';

        tracks =
            JSON.parse(await request.get(spotifyConfig.apiEndpoint + '/search?' + query, {
                headers: {'Content-Type': 'application/json'},
                auth: {'bearer': authToken}
            }));
    } catch (err) {

        error = err.error.error ||
            {name: err.name, code: err.statusCode, message: err.message};
    }

    return {tracks, error};
}

