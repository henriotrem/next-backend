const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const photoSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    originId: { type: mongoose.ObjectId, required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    metadata: {
        width: { type: String },
        height: { type: String },
        photo: {
            cameraMake: { type: String },
            cameraModel: { type: String },
            focalLength: { type: Number },
            apertureFNumber: { type: Number },
            isoEquivalent: { type: Number }
        }
    },
    geospatiality: {
        latitude: {type: Number},
        longitude: {type: Number},
        accuracy: {type: Number}
    },
    temporality: { type: Number, required: true }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

photoSchema.plugin(mongoosePaginate);
photoSchema.index({userId:1, temporality: 1, filename: 1}, {unique: true});
photoSchema.index({userId:1, originId:1, temporality: 1});

module.exports = mongoose.model('Photo', photoSchema);
