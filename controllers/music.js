const Music = require('../models/Music');

exports.addMusics = (req, res) => {

    const musics = req.body.musics.map(obj=> ({ ...obj, userId: req.params.userId}));

    Music.insertMany(musics, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({musics: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({musics: full})
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

exports.updateMusic = (req, res) => {

    const filter = {
        '_id' :  req.params.musicId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Music.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchMusic = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.musicId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Music.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchMusics = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Music.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteMusic = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.musicId
    };

    Music.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteMusics = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Music.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getMusic = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.musicId
    };

    Music.findOne(filter)
        .then((music) => res.status(200).json(music))
        .catch(error => res.status(400).json(error));
};

exports.getMusics = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    if (req.query.temporality) {
        filter.temporality = req.query.temporality
    }
    if (req.query.start && req.query.end) {
        filter.temporality = {
            $gte: req.query.start,
            $lt: req.query.end
        }
    }
    const options = {
        sort:     { temporality: 1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Music.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({musics: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countMusics = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    if (req.query.temporality) {
        filter.temporality = req.query.temporality
    }
    if (req.query.start && req.query.end) {
        filter['duration.start'] = {
            $gte: req.query.start,
            $lt: req.query.end
        }
    }
    const options = {
        sort:     { temporality: 1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Music.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};
