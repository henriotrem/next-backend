const mongoose = require('mongoose');

const positionSchema = mongoose.Schema({
    userId: { type: mongoose.ObjectId, ref: 'User', required: true },
    sourceId: { type: mongoose.ObjectId },
    geospatiality: {
        latitude: {type: Number},
        longitude: {type: Number},
        accuracy: {type: Number}
    },
    temporality: { type: Number}
}, { timestamps: true });

positionSchema.index({userId:1, temporality: 1}, {unique: true});
positionSchema.index({userId:1, createdAt: 1});

module.exports = mongoose.model('Position', positionSchema);
