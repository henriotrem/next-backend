const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const fileSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    sourceId: {type: mongoose.ObjectId, ref: 'Source', required: true},
    signature: {type: String, required: true },
    name: {type: String},
    size: {type: Number},
    total: {type: Number},
    processed: {type: Number}
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

fileSchema.plugin(mongoosePaginate);
fileSchema.index({userId: 1, sourceId: 1, signature: 1}, {unique: true});

module.exports = mongoose.model('File', fileSchema);
