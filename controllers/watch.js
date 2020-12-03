const Watch = require('../models/Watch');

exports.addWatches = (req, res) => {

    const watches = req.body.watches.map(obj=> ({ ...obj, userId: req.params.userId }));

    Watch.insertMany(watches, {ordered: false})
        .then((result) => {
            const insertedIds = result.map((object, index) => ({
                index: index,
                _id: object._id
            }));
            res.status(200).json({insertedIds});
        })
        .catch((error) => {
                if (error.code === 11000) {
                    const insertedIds  = error.result.result.insertedIds.filter(
                        (element1) => error.writeErrors.filter(
                            (element2) => element2.index === element1.index).length === 0);

                    res.status(200).json({insertedIds});
                } else {
                    res.status(400).json(error);
                }
            }
        );
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
