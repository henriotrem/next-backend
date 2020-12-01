const mongoose = require('mongoose');

const websiteSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    sourceId: { type: mongoose.ObjectId, ref: 'Source', required: true },
    sourceUrl: { type: String, required: true },
    geospatiality: [ { type: Number} ],
    temporality: { type: Number, required: true }
}, { timestamps: true });


websiteSchema.index({userId:1, temporality: 1}, {unique: true});
websiteSchema.index({userId:1, sourceId:1, temporality: 1});

module.exports = mongoose.model('Website', websiteSchema);
