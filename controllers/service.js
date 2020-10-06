const Service = require('../models/Service');

exports.getServices = (req, res, next) => {
    const filter = {
        'userId': req.params.userId
    };
    Service.find(filter).where('_id').in(req.params.ids.split(';'))
        .then(services => res.status(200).json(services))
        .catch(error => res.status(404).json({ error}));
};

exports.getAllServices = (req, res, next) => {
    const filter = {
        'userId': req.params.userId
    };
    Service.find(filter).limit(10)
        .then(services => res.status(200).json(services))
        .catch(error => res.status(400).json({ error}));
};

exports.deleteService = (req, res, next) => {

    Service.deleteOne({ _id : req.params.id})
        .then(() => res.status(200).json({ message: 'Service deleted' }))
        .catch(error => res.status(400).json({ error}));
};

