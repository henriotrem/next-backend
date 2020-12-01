const Segment = require('../models/Segment');
const Position = require('../models/Position');
const User = require('../models/User');

const geospatiality = require("./library/dimensions/geospatiality");

exports.createSegments = (req, res) => {

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

exports.getSegments = (req, res) => {

    let minTime = +req.query.start;
    let maxTime = minTime + 3600*24;

    const filter1 = {
        'userId': req.params.userId,
        'duration.start': {
            '$lt': minTime
        },
    };

    const filter2 = {
        'userId': req.params.userId,
        'duration.start': {
            '$gte': minTime,
            '$lt': maxTime
        },
    };

    Segment.findOne(filter1).sort({'duration.start':-1}).then(
        (segment) => {

            Segment.find(filter2).sort({'duration.start': 1})
                .then(
                    (segments) => {

                        segments.unshift(segment);
                        res.status(200).json(segments);
                    })
                .catch(error => res.status(400).json({ error}));
        }
    ).catch(error => res.status(400).json({ error}));
}
