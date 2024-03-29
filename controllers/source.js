const Source = require('../models/Source');

exports.addSources = (req, res) => {

    const sources = req.body.sources.map(obj=> ({ ...obj, userId: req.params.userId}));

    Source.insertMany(sources, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({sources: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({sources: full})
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

exports.updateSource = (req, res) => {

    const filter = {
        '_id' :  req.params.sourceId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Source.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchSource = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.sourceId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Source.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchSources = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Source.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteSource = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.sourceId
    };

    Source.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteSources = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Source.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getSource = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.sourceId
    };

    Source.findOne(filter)
        .then((source) => res.status(200).json(source))
        .catch(error => res.status(400).json(error));
};

exports.getSources = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Source.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({sources: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countSources = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Source.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};


