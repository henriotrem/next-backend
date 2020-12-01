const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    sourceId: { type: mongoose.ObjectId, ref: 'Source', required: true },
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
    geospatiality: [ { type: Number} ],
    temporality: { type: Number, required: true }
}, { timestamps: true });


photoSchema.index({userId:1, temporality: 1, filename: 1}, {unique: true});
photoSchema.index({userId:1, sourceId:1, temporality: 1});

module.exports = mongoose.model('Photo', photoSchema);
