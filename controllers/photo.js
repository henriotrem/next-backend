const Photo = require('../models/Photo');
const fs = require('fs');

exports.addPhoto = (req, res, next) => {
    const photoObject = req.file ?
        {
            ...JSON.parse(req.body.photo),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    const photo = new Photo({
        ...photoObject
    });
    photo.save()
        .then((photo) => {

            res.status(201).json(photo)
        })
        .catch(error => res.status(400).json({ error }));
};

exports.updatePhoto = (req, res, next) => {
    const photoObject = req.file ?
        {
            ...JSON.parse(req.body.photo),
            type: 'photo',
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body,
            type: 'photo'
    };
    Photo.updateOne({ _id : req.params.id}, { ...photoObject, _id: req.params.id})
        .then((photo) => res.status(200).json({ message: 'Photo updated' }))
        .catch(error => res.status(400).json({ error}));
};

exports.deletePhoto = (req, res, next) => {

    Photo.deleteOne({ _id : req.params.id})
        .then(() => res.status(200).json({ message: 'Photo deleted' }))
        .catch(error => res.status(400).json({ error}));

    /*
    Photo.findOne({ _id : req.params.id})
        .then(photo => {
            const filename = photo.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Photo.deleteOne({ _id : req.params.id})
                    .then(() => res.status(200).json({ message: 'Photo deleted' }))
                    .catch(error => res.status(400).json({ error}));
            });
        })
        .catch(error => res.status(500).json({ error}));*/
};

exports.getPhotos = (req, res, next) => {
    Photo.find().where('_id').in(req.params.ids.split(';'))
        .then(photos => res.status(200).json(photos))
        .catch(error => res.status(404).json({ error}));
}

exports.getAllPhotos = (req, res, next) => {

    let minTime = +req.query.start;
    let maxTime = minTime + 3600*24;

    const filter = {
        'userId': req.params.userId,
        'temporality': {
            '$gte': minTime,
            '$lt': maxTime
        },
    };

    Photo.find(filter)
        .then(photos => res.status(200).json(photos))
        .catch(error => res.status(400).json({ error}));
};
