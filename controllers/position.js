const Position = require('../models/Position');

exports.addPositions = (req, res) => {

    const positions = req.body.positions.map(obj=> ({ ...obj, userId: req.params.userId}));

    Position.insertMany(positions, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({positions: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({positions: full})
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

exports.updatePosition = (req, res) => {

    const filter = {
        '_id' :  req.params.positionId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Position.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchPosition = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.positionId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Position.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchPositions = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Position.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deletePosition = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.positionId
    };

    Position.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deletePositions = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Position.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getPosition = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.positionId
    };

    Position.findOne(filter)
        .then((position) => res.status(200).json(position))
        .catch(error => res.status(400).json(error));
};

exports.getPositions = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Position.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({positions: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countPositions = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Position.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};
