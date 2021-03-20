const request = require('request-promise');

const providerController = require('./provider');

const Source = require('../models/Source');
const Api = require('../models/Api');

exports.getData = (req, res) => {

    Api.findOne({'userId': req.params.userId, '_id': req.query.apiId}).then((api) => {

        Source.findOne({'userId': req.params.userId, '_id': req.query.sourceId}).then((source) => {

            if (api && source) {

                if (source.name === 'google-photos-api') {
                    this.libraryGooglePhotoApiSearch(source, api, req).then(photos => res.status(200).json({photos}));
                }
            } else {
                res.status(400).send();
            }
        });
    });
}

exports.getContext = (req, res) => {

    Api.findOne({'userId': req.params.userId, '_id': req.query.apiId}).then((api) => {

        Source.findOne({'userId': req.params.userId, '_id': req.query.sourceId}).then((source) => {

            if (api && source) {

                if(source.name === 'spotify-context-api') {
                    this.librarySpotifyApiSearch(source, api, req).then(tracks => res.status(200).json({tracks}));
                } else if(source.name === 'google-places-api') {
                    this.libraryGooglePlacesApiSearch(source, api, req).then(locations => res.status(200).json({locations}));
                }
            } else {
                res.status(400).send();
            }
        });
    });
}

exports.libraryGooglePhotoApiSearch = async (source, api, req) => {

    let loop = true;
    const photos = [];
    const date = new Date(+req.query.start*1000);
    const parameters = {
        pageSize: 100,
        filters: {
            contentFilter: {},
            mediaTypeFilter: {mediaTypes: ['PHOTO']},
            dateFilter: {
                ranges: [{
                    startDate: {
                        'year': date.getUTCFullYear(),
                        'month': date.getUTCMonth() + 1,
                        'day': date.getUTCDate()
                    },
                    endDate: {
                        'year': date.getUTCFullYear(),
                        'month': date.getUTCMonth() + 1,
                        'day': date.getUTCDate() + 1
                    }
                }]
            }
        }
    };

    do {

        try {

            const result =
                await request.post(source.endpoint + '/v1/mediaItems:search', {
                    headers: {'Content-Type': 'application/json'},
                    json: parameters,
                    auth: {'bearer': api.token},
                });

            const items = result && result.mediaItems ?
                result.mediaItems
                    .filter(x => x)
                    .filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
                [];

            parameters.pageToken = result.nextPageToken;

            for (let media of items) {

                let photo = {
                    url: media.baseUrl,
                    filename: media.filename,
                    mimeType: media.mimeType,
                    metadata: {
                        width: media.mediaMetadata.width,
                        height: media.mediaMetadata.height,
                        photo: media.mediaMetadata.photo
                    },
                    temporality: (new Date(media.mediaMetadata.creationTime)).getTime() / 1000
                };

                photos.push(photo);
            }
            loop = false;
        } catch (e) {

            if (e.statusCode === 401) {
                api.token = await providerController.refreshToken(source, api);
            } else {
                loop = false;
            }
        }

    } while (loop || parameters.pageToken != null);

    return photos;
}

exports.librarySpotifyApiSearch = async (source, api, req) => {

    let loop = true;
    const tracks = [];
    const query = 'q=track:' + encodeURI(req.query.track) + '%20artist:' + encodeURI(req.query.artist) + '&type=track';

    do {

        try {

            const result = await request.get(source.endpoint + '/v1/search?' + query, {
                headers: {'Content-Type': 'application/json'},
                auth: {'bearer': api.token}
            })
            tracks.push(...JSON.parse(result).tracks.items);
            loop = false;

        } catch(e) {
            if (e.statusCode === 401) {
                api.token = await providerController.refreshToken(source, api);
            } else {
                loop = false;
            }
        }
    } while (loop);

    return tracks;
}

exports.libraryGooglePlacesApiSearch = async (source, api, req) => {

    let loop = true;
    const locations = [];

    do {

        try {
            const query = 'location=' + req.query.location + '&radius=50&key=' + api.token;
            const result = await request.get(source.endpoint + '/maps/api/place/nearbysearch/json?' + query, {
                headers: {'Content-Type': 'application/json'}
            })
            locations.push(...JSON.parse(result).results);

            loop = false;

        } catch(e) {
            loop = false;
        }
    } while (loop && locations.length === 0);

    return locations;
}
