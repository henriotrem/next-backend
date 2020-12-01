const Photo = require('../models/Photo');

exports.addPhotos = (req, res) => {

    let photos = req.body.photos;

    photos.map(obj=> ({ ...obj, userId: req.params.userId }));

    Photo.insertMany(photos, {ordered: false})
        .then(() => res.status(200).json({ message: 'Photos inserted'}))
        .catch((error)=>res.status(400).json(error));
};

exports.updatePhotos = (req, res) => {
    const filter = {
        userId:req.params.userId,
        ...req.body.filter
    };
    const set = {
        ...req.body.set
    };

    Photo.update(filter, set, { multi: true })
        .then((photos) => res.status(200).json({ photos: photos, message: 'Photos updated' }))
        .catch(error => res.status(400).json(error));
};

exports.deletePhotos = (req, res) => {

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

    Photo.deleteMany(filter)
        .then(() => res.status(200).json({ message: 'Photo deleted' }))
        .catch(error => res.status(400).json(error));
};

exports.getPhotos = (req, res) => {

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

    Photo.find(filter)
        .then(photos => res.status(200).json(photos))
        .catch(error => res.status(404).json(error));
}
