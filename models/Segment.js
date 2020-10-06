const mongoose = require('mongoose');

const segmentSchema = mongoose.Schema({
    userId: { type: mongoose.ObjectId, ref: 'User', required: true },
    duration: {
        start: { type: Number, required: true },
        end: { type: Number, required: true },
    },
    distance: { type: Number },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    path: [ {
        latitude: { type: Number },
        longitude: { type: Number },
        timestamp: { type: Number}
    } ]
});

segmentSchema.index({userId:1, 'duration.start': 1}, {unique: true});

module.exports = mongoose.model('Segment', segmentSchema);
