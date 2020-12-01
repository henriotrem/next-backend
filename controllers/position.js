const Position = require('../models/Position');

exports.addPositions = (req, res) => {

    let positions = req.body.positions;

    positions.map(obj=> ({ ...obj, userId: req.params.userId }));

    Position.insertMany(positions, {ordered: false})
        .then(() => res.status(200).json({ message: 'Positions inserted'}))
        .catch((error)=>res.status(400).json(error));
};

exports.updatePositions = (req, res) => {
    const filter = {
        userId:req.params.userId,
        ...req.body.filter
    };
    const set = {
        ...req.body.set
    };

    Position.update(filter, set, { multi: true })
        .then((positions) => res.status(200).json({ positions: positions, message: 'Positions updated' }))
        .catch(error => res.status(400).json(error));
};

exports.deletePositions = (req, res) => {

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

    Position.deleteMany(filter)
        .then(() => res.status(200).json({ message: 'Position deleted' }))
        .catch(error => res.status(400).json(error));
};

exports.getPositions = (req, res) => {

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

    Position.find(filter)
        .then(positions => res.status(200).json(positions))
        .catch(error => res.status(404).json(error));
}
