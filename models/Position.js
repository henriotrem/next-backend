const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const positionSchema = mongoose.Schema({
    userId: { type: mongoose.ObjectId, ref: 'User', required: true },
    originId: { type: mongoose.ObjectId, required: true },
    geospatiality: {
        latitude: {type: Number},
        longitude: {type: Number},
        accuracy: {type: Number}
    },
    temporality: { type: Number}
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

positionSchema.plugin(mongoosePaginate);
positionSchema.index({userId:1, temporality: 1}, {unique: true});
positionSchema.index({userId:1, originId:1, temporality: 1});
positionSchema.index({userId:1, createdAt: 1});

module.exports = mongoose.model('Position', positionSchema);
