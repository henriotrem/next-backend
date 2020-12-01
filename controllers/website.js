const Website = require('../models/Website');

exports.addWebsites = (req, res) => {

    let websites = req.body.websites;

    websites.map(obj=> ({ ...obj, userId: req.params.userId }));

    Website.insertMany(req.body.websites, {ordered: false})
        .then(() => res.status(200).json({ message: 'Websites inserted'}))
        .catch((error)=>res.status(400).json(error));
};

exports.updateWebsites = (req, res) => {
    const filter = {
        userId:req.params.userId,
        ...req.body.filter
    };
    const set = {
        ...req.body.set
    };

    Website.update(filter, set, { multi: true })
        .then((websites) => res.status(200).json({ websites: websites, message: 'Websites updated' }))
        .catch(error => res.status(400).json(error));
};

exports.deleteWebsites = (req, res) => {

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

    Website.deleteMany(filter)
        .then(() => res.status(200).json({ message: 'Website deleted' }))
        .catch(error => res.status(400).json(error));
};

exports.getWebsites = (req, res) => {

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

    Website.find(filter)
        .then(websites => res.status(200).json(websites))
        .catch(error => res.status(404).json(error));
}
