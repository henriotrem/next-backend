const Api = require('../models/Api');

exports.addApis = (req, res) => {

    const apis = req.body.apis.map(obj=> ({ ...obj, userId: req.params.userId, sourceId: req.params.sourceId}));

    Api.insertMany(apis, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({apis: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({apis: full})
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

exports.updateApi = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' :  req.params.apiId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };

    Api.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchApi = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' : req.params.apiId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
            'sourceId' : req.params.sourceId
        }
    };

    Api.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchApis = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
            'sourceId' : req.params.sourceId
        }
    };

    Api.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteApi = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' : req.params.apiId
    };

    Api.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteApis = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };

    Api.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getApi = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' : req.params.apiId
    };

    Api.findOne(filter)
        .then((api) => res.status(200).json(api))
        .catch(error => res.status(400).json(error));
};

exports.getApis = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Api.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({apis: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countApis = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Api.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};



