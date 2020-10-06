const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    token: { type: String},
    scopes: [ { type: String} ]
});

serviceSchema.index({userId:1, name: 1}, {unique: true});

module.exports = mongoose.model('Service', serviceSchema);
