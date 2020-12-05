const File = require('../models/File');

exports.addFiles = (req, res) => {

    const files = req.body.files.map(obj=> ({ ...obj, userId: req.params.userId, sourceId: req.params.sourceId}));

    File.insertMany(files, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({files: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({files: full})
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

exports.updateFile = (req, res) => {

    const filter = {
        'sourceId' : req.params.sourceId,
        '_id' :  req.params.fileId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };

    File.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchFile = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' : req.params.fileId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
            'sourceId' : req.params.sourceId
        }
    };

    File.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchFiles = (req, res) => {

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

    File.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteFile = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' : req.params.fileId
    };

    File.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteFiles = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };

    File.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getFile = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' : req.params.fileId
    };

    File.findOne(filter)
        .then((file) => res.status(200).json(file))
        .catch(error => res.status(400).json(error));
};

exports.getFiles = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    File.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({files: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countFiles = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    File.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};

exports.patchFileProcessed = (req, res) => {
    const filter = {
        'userId': req.params.userId,
        'sourceId' : req.params.sourceId,
        '_id' : req.params.fileId
    };
    const set = {
        $inc:{
            'processed':req.body.increment
        }
    };
    File.findOneAndUpdate(filter, set, { new:true, useFindAndModify: false })
        .then((file) => {
            res.status(200).json({processed: file.processed})
        })
        .catch(error => res.status(400).json(error));
};


