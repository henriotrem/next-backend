const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    signature: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    total: { type: Number, required: true },
    processed: { type: Number, required: true },
    universes: [ { type: String} ]
});

fileSchema.index({userId:1, signature: 1}, {unique: true});

module.exports = mongoose.model('File', fileSchema);
