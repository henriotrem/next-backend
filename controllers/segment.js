const Segment = require('../models/Segment');
const Position = require('../models/Position');
const User = require('../models/User');

const geospatiality = require("./library/dimensions/geospatiality");

exports.addSegments = (req, res) => {

    User.updateOne({'_id':req.params.userId}, { $set: { 'segments.inProgress' : true } } ).then(
        (result) => {

            if(result.nModified || true) {

                User.findOne({'_id':req.params.userId}).then(
                    (user)=> {

                        Position.findOne({'userId':req.params.userId}).sort({'createdAt':-1}).limit(1)
                            .then(
                                (position) => {

                                    if(position.createdAt > user.segments.updatedAt) {

                                        res.status(200).json({message:'Calculation in progress'});
                                        createSegments(user._id, user.segments.updatedAt, position.createdAt, null);
                                    } else {

                                        User.updateOne( {'_id':req.params.userId}, { $set: { 'segments.inProgress' : false } } ).then(
                                            () => {

                                                res.status(200).json({message:'Segments are already up to date'})
                                            }
                                        ).catch(error => console.log(error));
                                    }

                                }).catch(error => res.status(404).json({ error}));
                    }
                ).catch(error => res.status(404).json({ error}));
            } else {

                res.status(400).json({message:'Calculation is already in progress'});
            }
        }
    ).catch(error => res.status(404).json({ error}));
};

function createSegments(userId, minDate, maxDate, minTemporality) {

    let filter1 = {
        'userId': userId,
        'createdAt': {
            '$gt': minDate,
            '$lte': maxDate
        }
    };

    if(minTemporality)
        filter1.temporality = { '$gte': minTemporality }

    const sort1 = {'temporality': 1};

    let segment1 = null;
    let segment2 = null;
    let requests = 2;

    Position.findOne(filter1).sort(sort1).limit(1).then(
        (position) => {

            const filter2 = {
                'userId': userId,
                'duration.start': {
                    '$lt': position.temporality
                }
            };
            const sort2 = {'duration.start': -1};

            Segment.findOne(filter2).sort(sort2).limit(1).then(
                (segment) => {

                    segment1 = segment;

                    if (--requests === 0)
                        createSegmentsBis(userId, minDate, maxDate, segment1, segment2);

                }).catch(error => console.log(error));

            const filter3 = {
                'userId': userId,
                'duration.start': {
                    '$gt': position.temporality
                }
            };
            const sort3 = {'duration.start': 1};

            Segment.findOne(filter3).sort(sort3).limit(1).then(
                (segment) => {

                    segment2 = segment;

                    if (--requests === 0)
                        createSegmentsBis(userId, minDate, maxDate, segment1, segment2);

                }).catch(error => console.log(error));
        }).catch();
}

function createSegmentsBis(userId, minDate, maxDate, segment1, segment2) {

    let filter1 = {
        'userId': userId,
        'createdAt': {
            '$lte': maxDate
        }
    };

    if(segment1 || segment2)
        filter1.temporality = {};

    if(segment1)
        filter1.temporality['$gte'] = segment1.duration.start;

    if(segment2)
        filter1.temporality['$lte'] = segment2.duration.start;

    const sort1 = {'temporality': 1};

    Position.find(filter1).sort(sort1).limit(10000).then(
        (positions) => {

            createSegmentsBisBis(userId, minDate, maxDate, segment1, segment2, positions);
        }
    ).catch(error=>console.log(error));
}

function createSegmentsBisBis(userId, minDate, maxDate, segment1, segment2, positions) {

    let previous = positions[0];
    let serie = [previous];
    let serieType = !segment1 ? 'STILL' : segment1.path.length > 0 ? 'MOVING' : 'STILL';
    let serieTotalDistance = 0

    for(let i = 1; i < positions.length; i++) {

        let current = positions[i];

        if((current.geospatiality.latitude !== previous.geospatiality.latitude || current.geospatiality.longitude !== previous.geospatiality.longitude) && current.geospatiality.accuracy < 100) {

            let distance = geospatiality.pointDistance([current.geospatiality.latitude, current.geospatiality.longitude], [previous.geospatiality.latitude, previous.geospatiality.longitude]) * 1000;
            let duration = current.temporality - previous.temporality;
            let velocity = distance / duration ;

            let serieDistance = geospatiality.pointDistance([current.geospatiality.latitude, current.geospatiality.longitude], [serie[0].geospatiality.latitude, serie[0].geospatiality.longitude]) * 1000;
            let type = serieType;

            if (!segment1 || serie[0].temporality !== segment1.duration.start || serie.length > segment1.path.length) {

                if (serieType === 'MOVING') {
                    if (velocity < 0.4) {
                        type = 'STILL';
                    } else {
                        type = 'MOVING';
                    }
                } else {
                    if ((serieDistance - current.geospatiality.accuracy) > 100) {
                        type = 'MOVING';
                    } else {
                        type = 'STILL';
                    }
                }
            }

            if(serieType !== type ) {

                saveSegment(userId, serieType, serie, serieTotalDistance, segment1, segment2);

                serie = [previous];
                serieType = type;
                serieTotalDistance = 0;
            }

            serie.push(current);
            serieTotalDistance += distance;

            previous = current;
        }
    }

    console.log('NEXT : ' + positions.length);

    if(positions.length === 10000) {

        createSegments(userId, minDate, maxDate, serie[0].temporality);
    } else {

        saveSegment(userId, serieType, serie, serieTotalDistance, segment1, segment2);
        updateUser(userId, maxDate);
    }
}

function updateUser(userId, updatedAt) {

    User.updateOne( {'_id':userId}, { $set: { 'segments.inProgress' : false, 'segments.updatedAt': updatedAt } } ).then(
        () => {

            console.log('Calculation is finished');
        }
    ).catch(error => console.log(error));
}

function saveSegment(userId, serieType, serie, serieTotalDistance, segment1, segment2) {

    let segment = {
        userId: userId,
        duration : {
            start: serie[0].temporality,
            end: serie[serie.length-1].temporality
        },
        distance: 0,
        location: serie[0].geospatiality,
        path: []
    }

    if(segment1 && segment.duration.start === segment1.duration.start)
        segment._id = segment1._id;

    if(segment2 && segment.duration.end === segment2.duration.end)
        segment._id = segment2._id;


    if(serieType === 'MOVING') {

        segment.distance = serieTotalDistance;

        let factor = 1;//Math.ceil(serie.length / 10)

        for(let i = factor; i < serie.length; i = i + factor) {

            let point = {
                latitude: serie[i].geospatiality.latitude,
                longitude: serie[i].geospatiality.longitude,
                timestamp: serie[i].temporality,
            }

            segment.path.push(point);
        }
    }

    if (segment._id) {

        console.log('Update : ' + segment._id);
        Segment.updateOne({_id: segment._id}, segment).then().catch(error => console.log(error));
    } else {

        (new Segment(segment)).save().then().catch(error => console.log(error));
    }
}

exports.addSegments = (req, res) => {

    const segments = req.body.segments.map(obj=> ({ ...obj, userId: req.params.userId}));

    Segment.insertMany(segments, {ordered: false})
        .then((result) => {

            if(req.query._response === 'none') {
                res.status(200).send()
            } else if(req.query._response === 'partial') {
                const partial = result.map((object, index) => ({
                    index: index,
                    _id: object._doc._id
                }));
                res.status(200).json({segments: partial});
            } else {
                const full = result.map((object, index) => ({
                    index: index,
                    ...object._doc
                }));
                res.status(200).json({segments: full})
            }
        })
        .catch((error) => {
                if (error.code === 11000) {
                    const insertedIds  = error.result.result.insertedIds.filter(
                        (element1) => error.writeErrors.filter(
                            (element2) => element2.index === element1.index).length === 0);

                    res.status(200).json(insertedIds);
                } else {
                    res.status(400).json(error);
                }
            }
        );
};

exports.updateSegment = (req, res) => {

    const filter = {
        '_id' :  req.params.segmentId
    };
    const set = {
        ...req.body,
        'userId': req.params.userId
    };

    Segment.replaceOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchSegment = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.segmentId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId,
        }
    };

    Segment.updateOne(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.patchSegments = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const set = {
        $set: {
            ...req.body,
            'userId': req.params.userId
        }
    };

    Segment.updateMany(filter, set)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteSegment = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.segmentId
    };

    Segment.deleteOne(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.deleteSegments = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };

    Segment.deleteMany(filter)
        .then(() => res.status(200).send())
        .catch(error => res.status(400).json(error));
};

exports.getSegment = (req, res) => {

    const filter = {
        'userId': req.params.userId,
        '_id' : req.params.segmentId
    };

    Segment.findOne(filter)
        .then((segment) => res.status(200).json(segment))
        .catch(error => res.status(400).json(error));
};

exports.getSegments = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Segment.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.json({segments: result.docs})
        })
        .catch(error => res.status(400).json(error));
};

exports.countSegments = (req, res) => {

    const filter = {
        'userId': req.params.userId
    };
    const options = {
        sort:     { createdAt: -1 },
        offset:   req.query._offset ? parseInt(req.query._offset) : 0,
        limit:    req.query._limit ? parseInt(req.query._limit) : 30
    };

    Segment.paginate(filter, options)
        .then((result) => {
            res.status(200);
            res.setHeader('Content-Range', 'items ' + result.offset + '-' + Math.min((result.offset + result.limit), result.total) + '/' + result.total);
            res.send()
        })
        .catch(error => res.status(400).json(error));
};
