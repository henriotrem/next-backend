const mongoose = require('mongoose');

const sourceSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    type: { type: String, required: true },
    api: {
        email: { type: String },
        token: { type: String },
        refreshToken: { type: String },
        callback: { type: String },
        scopes: [{ type: String }],
    },
    file: {
        signature: { type: String },
        name: { type: String },
        size: { type: Number },
        type: { type: String },
        total: { type: Number },
        processed: { type: Number }
    }
}, { timestamps: true });

sourceSchema.index({userId:1, name: 1}, {unique: true});

module.exports = mongoose.model('Source', sourceSchema);
