const Universe = require('../models/Universe');

const writer = require("./library/writer");
const viewer = require("./library/viewer");

exports.addUniverses = (req, res, next) => {

    let universes = req.body.sources;

    universes.map(obj=> ({ ...obj, userId: req.params.userId }));

    Universe.insertMany(universes, {ordered: false})
        .then(() => res.status(201).json({ message : 'Universes created'}))
        .catch((error) => res.status(400).json({ error }) );
}

exports.updateUniverses = (req, res) => {
    const filter = {
        userId:req.params.userId,
        ...req.body.filter
    };
    const set = {
        ...req.body.set
    };

    Universe.update(filter, set, { multi: true })
        .then((universes) => res.status(200).json({ universes: universes, message: 'Universes updated' }))
        .catch(error => res.status(400).json(error));
};

exports.deleteUniverses = (req, res) => {

    let filter = {
        userId: req.params.userId
    }
    if ( req.query.ids ) {
        filter._id = {
            $in: req.query.ids.split(',')
        }
    }

    Universe.deleteMany(filter)
        .then(() => res.status(200).json({ message: 'Universes deleted' }))
        .catch(error => res.status(400).json(error));
};

exports.getUniverses = (req, res) => {

    let filter = {
        userId: req.params.userId
    }
    if ( req.query.ids ) {
        filter._id = {
            $in: req.query.ids.split(',')
        }
    }

    Universe.find(filter)
        .then(websites => res.status(200).json(websites))
        .catch(error => res.status(400).json(error));
}

exports.addElement = (req, res) => {

    Universe.findOne({ key : req.params.key})
        .then((universe) => {
            writer.create(universe, req.body);
            res.status(200).json({ message : 'Element added' });
        })
        .catch(error => res.status(400).json(error));
}

exports.getIndexes = (req, res) => {

    viewer.indexes(req.params.key ,req.query.ids.split(','), (indexes) => {
            res.status(200).json(indexes);
        });
}

exports.getLists = (req, res) => {

    viewer.lists(req.params.key ,req.query.ids.split(','), (lists) => {
        res.status(200).json(lists);
    });
}

exports.addRandomElements = (req, res) => {

    Universe.findOne({ key : req.params.key})
        .then((universe) => {
            writer.randomize(universe, req.body.type, req.body.number);
            res.status(200).json({ message : 'Elements are being added' });
        })
        .catch(error => res.status(400).json(error));
}


