const Universe = require('../models/Universe');

const writer = require("./library/writer");
const viewer = require("./library/viewer");

exports.addUniverse = (req, res, next) => {
    const universe = new Universe({
        ...req.body
    });
    universe.save()
        .then(() => res.status(201).json({ message : 'Universe created', universe : universe }))
        .catch(
            (error) => {
                console.log(error);
                res.status(400).json({ error });
            }
        );
}

exports.getAllUniverses = (req, res, next) => {
    Universe.find()
        .then(universes => res.status(200).json( universes ))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneUniverse = (req, res, next) => {
    Universe.findOne({ key : req.params.key})
        .then(universe => res.status(200).json( universe ))
        .catch(error => res.status(404).json({ error }));
}

exports.deleteUniverse = (req, res, next) => {
    Universe.deleteOne({ key : req.params.key})
        .then(() => res.status(200).json({ message : 'Universe deleted' }))
        .catch(error => res.status(400).json({ error }));
}

exports.addElement = (req, res, next) => {
    Universe.findOne({ key : req.params.key})
        .then((universe) => {

            writer.create(universe, req.body);
            res.status(200).json({ message : 'Element added' });
        })
        .catch(error => res.status(404).json({ error }));
}

exports.getIndexes = (req, res, next) => {
    viewer.indexes(req.params.key ,req.params.ids.split(';'), (indexes) => {
            res.status(200).json(indexes);
        });
}

exports.getLists = (req, res, next) => {
    viewer.lists(req.params.key ,req.params.ids.split(';'), (lists) => {
        res.status(200).json(lists);
    });
}

exports.addRandomElements = (req, res, next) => {
    Universe.findOne({ key : req.params.key})
        .then((universe) => {

            writer.randomize(universe, req.body.type, req.body.number);
            res.status(200).json({ message : 'Elements are being added' });
        })
        .catch(error => res.status(404).json({ error }));
}


