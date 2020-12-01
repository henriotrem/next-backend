const Watch = require('../models/Watch');

exports.addWatches = (req, res) => {

    let watches = req.body.watches;

    watches.map(obj=> ({ ...obj, userId: req.params.userId }));

    Watch.insertMany(req.body.watches, {ordered: false})
        .then(() => res.status(200).json({ message: 'Watches inserted'}))
        .catch((error)=>res.status(400).json(error));
};

exports.updateWatches = (req, res) => {
    const filter = {
        userId:req.params.userId,
        ...req.body.filter
    };
    const set = {
        ...req.body.set
    };

    Watch.update(filter, set, { multi: true })
        .then((watches) => res.status(200).json({ watches: watches, message: 'Watches updated' }))
        .catch(error => res.status(400).json(error));
};

exports.deleteWatches = (req, res) => {

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

    Watch.deleteMany(filter)
        .then(() => res.status(200).json({ message: 'Watch deleted' }))
        .catch(error => res.status(400).json(error));
};

exports.getWatches = (req, res) => {

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

    Watch.find(filter)
        .then(watches => res.status(200).json(watches))
        .catch(error => res.status(404).json(error));
}
