const mongoose = require('mongoose');

const watchSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    sourceId: { type: mongoose.ObjectId, ref: 'Source', required: true },
    title: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    geospatiality: [ { type: Number} ],
    temporality: { type: Number, required: true }
}, { timestamps: true });


watchSchema.index({userId:1, temporality: 1}, {unique: true});
watchSchema.index({userId:1, sourceId:1, temporality: 1});

module.exports = mongoose.model('Watch', watchSchema);
