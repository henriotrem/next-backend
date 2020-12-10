const Website = require('../models/Website');

exports.addWebsites = (req, res) => {

    const websites = req.body.websites.map(obj=> ({ ...obj, userId: req.params.userId}));

    Website.insertMany(websites, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({websites: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({websites: full})
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

exports.updateWebsite = (req, res) => {

    const filter = {
        '_id' :  req.params.websiteId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Website.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchWebsite = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.websiteId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Website.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchWebsites = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Website.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteWebsite = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.websiteId
    };

    Website.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteWebsites = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Website.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getWebsite = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.websiteId
    };

    Website.findOne(filter)
        .then((website) => res.status(200).json(website))
        .catch(error => res.status(400).json(error));
};

exports.getWebsites = (req, res) => {

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

    Website.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({websites: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countWebsites = (req, res) => {

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

    Website.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};
