const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const externalSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    token: { type: String},
    scopes: [ { type: String} ]
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

externalSchema.plugin(mongoosePaginate);
externalSchema.index({userId:1, name: 1}, {unique: true});

module.exports = mongoose.model('External', externalSchema);
