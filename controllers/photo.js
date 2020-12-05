const Photo = require('../models/Photo');

exports.addPhotos = (req, res) => {

    const photos = req.body.photos.map(obj=> ({ ...obj, userId: req.params.userId}));

    Photo.insertMany(photos, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({photos: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({photos: full})
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

exports.updatePhoto = (req, res) => {

    const filter = {
        '_id' :  req.params.photoId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Photo.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchPhoto = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.photoId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Photo.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchPhotos = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Photo.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deletePhoto = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.photoId
    };

    Photo.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deletePhotos = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Photo.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getPhoto = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.photoId
    };

    Photo.findOne(filter)
        .then((photo) => res.status(200).json(photo))
        .catch(error => res.status(400).json(error));
};

exports.getPhotos = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Photo.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({photos: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countPhotos = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Photo.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};
