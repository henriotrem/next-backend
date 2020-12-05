const Watch = require('../models/Watch');

exports.addWatches = (req, res) => {

    const watches = req.body.watches.map(obj=> ({ ...obj, userId: req.params.userId}));

    Watch.insertMany(watches, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({watches: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({watches: full})
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

exports.updateWatch = (req, res) => {

    const filter = {
        '_id' :  req.params.watchId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Watch.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchWatch = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.watchId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Watch.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchWatches = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Watch.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteWatch = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.watchId
    };

    Watch.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteWatches = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Watch.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getWatch = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.watchId
    };

    Watch.findOne(filter)
        .then((watch) => res.status(200).json(watch))
        .catch(error => res.status(400).json(error));
};

exports.getWatches = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Watch.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({watches: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countWatches = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Watch.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};
