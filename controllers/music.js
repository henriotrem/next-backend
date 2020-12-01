const Music = require('../models/Music');

exports.addMusics = (req, res) => {

    let musics = req.body.musics;

    musics.map(obj=> ({ ...obj, userId: req.params.userId }));

    Music.insertMany(musics, {ordered: false})
        .then(() => res.status(200).json({ message: 'Musics inserted'}))
        .catch((error)=>res.status(400).json(error));
};

exports.updateMusics = (req, res) => {
    const filter = {
        userId:req.params.userId,
        ...req.body.filter
    };
    const set = {
        ...req.body.set
    };

    Music.update(filter, set, { multi: true })
        .then((musics) => res.status(200).json({ musics: musics, message: 'Musics updated' }))
        .catch(error => res.status(400).json(error));
};

exports.deleteMusics = (req, res) => {

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

    Music.deleteMany(filter)
        .then(() => res.status(200).json({ message: 'Music deleted' }))
        .catch(error => res.status(400).json(error));
};

exports.getMusics = (req, res) => {

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

    Music.find(filter)
        .then(musics => res.status(200).json(musics))
        .catch(error => res.status(404).json(error));
}