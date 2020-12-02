const Source = require('../models/Source');

exports.addSources = (req, res) => {

    let sources = req.body.sources;

    sources.map(obj=> ({ ...obj, userId: req.params.userId }));

    Source.insertMany(sources, {ordered: false})
        .then(() => res.status(200).json({ message: 'Sources inserted'}))
        .catch((error)=>res.status(400).json(error));
};

exports.updateSources = (req, res) => {
    const filter = {
        userId:req.params.userId,
        ...req.body.filter
    };
    const set = {
        ...req.body.set
    };

    Source.update(filter, set, { multi: true })
        .then((sources) => res.status(200).json({ sources: sources, message: 'Sources updated' }))
        .catch(error => res.status(400).json(error));
};

exports.deleteSources = (req, res) => {

    let filter = {
        userId: req.params.userId
    }
    if ( req.query.ids ) {
        filter._id = {
            $in: req.query.ids.split(',')
        }
    }
    if ( req.query.sourceId ) {
        filter.sourceId = req.query.sourceId;
    }
    if ( req.query.start && req.query.end ) {
        filter.temporality = {
            $gte: req.query.start,
            $lte: req.query.end
        }
    }

    Source.deleteMany(filter)
        .then(() => res.status(200).json({ message: 'Source deleted' }))
        .catch(error => res.status(400).json(error));
};

exports.getSources = (req, res) => {

    let filter = {
        userId: req.params.userId
    }
    if ( req.query.ids ) {
        filter._id = {
            $in: req.query.ids.split(',')
        }
    }
    if ( req.query.sourceId ) {
        filter.sourceId = req.query.sourceId;
    }
    if ( req.query.start && req.query.end ) {
        filter.temporality = {
            $gte: req.query.start,
            $lte: req.query.end
        }
    }

    Source.find(filter)
        .then(sources => res.status(200).json(sources))
        .catch(error => res.status(404).json(error));
}

exports.addApi = (req, res) => {
    const filter = {
        '_id' : req.params.id,
        'userId': req.params.userId
    };
    const set = {
        '$set' :
            {
                api: req.body
            }
    };
    Source.findOneAndUpdate(filter,set,{ new:true, useFindAndModify: false })
        .then((source) => res.status(201).json(source))
        .catch(error => res.status(400).json(error));
};

exports.updateApi = (req, res) => {
    const filter = {
        '_id' : req.params.id,
        'userId': req.params.userId
    };
    const set = {
        $inc: {
            "api.token": req.body.token
        }
    };
    Source.updateOne(filter, set)
        .then(() => res.status(200).json({ message: 'Api updated' }))
        .catch(error => res.status(400).json(error));
};

exports.addFile = (req, res) => {
    const filter = {
        '_id' : req.params.id,
        'userId': req.params.userId
    };
    const set = {
        '$set' :
            {
                file: req.body
            }
    };
    Source.findOneAndUpdate(filter,set,{ new:true, useFindAndModify: false })
        .then((source) => res.status(201).json(source))
        .catch(error => res.status(400).json(error));
};

exports.updateFile = (req, res) => {
    const filter = {
        '_id' : req.params.id,
        'userId': req.params.userId
    };
    const set = {
        $inc: {
            "file.processed": req.body.increment
        }
    };
    Source.updateOne(filter, set)
        .then(() => res.status(200).json({ message: 'File updated' }))
        .catch(error => res.status(400).json(error));
};


