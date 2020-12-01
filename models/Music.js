const mongoose = require('mongoose');

const musicSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    sourceId: { type: mongoose.ObjectId, ref: 'Source', required: true },
    track: { type: String, required: true },
    artists: [{ type: String, required: true }],
    geospatiality: [ { type: Number} ],
    temporality: { type: Number, required: true }
}, { timestamps: true });


musicSchema.index({userId:1, temporality: 1}, {unique: true});
musicSchema.index({userId:1, sourceId:1, temporality: 1});

module.exports = mongoose.model('Music', musicSchema);