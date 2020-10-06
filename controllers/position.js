const Position = require('../models/Position');

exports.addPosition = (req, res, next) => {
    const position = new Position({
        ...req.body
    });
    position.save()
        .then((position) => {

            res.status(201).json(position)
        })
        .catch(error => res.status(400).json({ error }));
};

exports.updatePosition = (req, res, next) => {
    const positionObject = {
            ...req.body
    };
    Position.updateOne({ _id : req.params.id}, { ...positionObject, _id: req.params.id})
        .then((position) => res.status(200).json({ message: 'Position updated' }))
        .catch(error => res.status(400).json({ error}));
};

exports.updatePositions = (req, res, next) => {
    const setterObject = {
        ...req.body.setter
    };
    const filterObject = {
        userId:req.body.userId,
        ...req.body.filter
    };

    Position.update(filterObject, setterObject, { multi: true })
        .then((positions) => res.status(200).json({ positions: positions, message: 'Positions updated' }))
        .catch(error => res.status(400).json({ error}));
};

exports.deletePosition = (req, res, next) => {

    Position.deleteOne({ _id : req.params.id})
        .then(() => res.status(200).json({ message: 'Position deleted' }))
        .catch(error => res.status(400).json({ error}));
};

exports.getPositions = (req, res, next) => {
    Position.find().where('_id').in(req.params.ids.split(';'))
        .then(positions => res.status(200).json(positions))
        .catch(error => res.status(404).json({ error}));
}

exports.getAllPositions = (req, res, next) => {
    Position.find().limit(10)
        .then(positions => res.status(200).json(positions))
        .catch(error => res.status(400).json({ error}));
};
