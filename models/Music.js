const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const musicSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    originId: { type: mongoose.ObjectId, required: true },
    track: { type: String, required: true },
    artists: [{ type: String, required: true }],
    geospatiality: {
        latitude: {type: Number},
        longitude: {type: Number},
        accuracy: {type: Number}
    },
    temporality: { type: Number, required: true }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});


musicSchema.plugin(mongoosePaginate);
musicSchema.index({userId:1, temporality: 1}, {unique: true});
musicSchema.index({userId:1, originId:1, temporality: 1});

module.exports = mongoose.model('Music', musicSchema);
