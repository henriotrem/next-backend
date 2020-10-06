const mongoose = require('mongoose');

const universeSchema = mongoose.Schema({
    key: { type: String, unique: true, index: true, required: true },
    description: { type: String, required: true },
    dimensions: [{
        key: {type: String, required: true},
        base: {
            root: {type: String, required: true},
            bit: {type: Number, required: true},
            alphabet: {type: String, required: true}
        }
    }],
    precision: { type: Number, required: true },
    limit: { type: Number, required: true }
})

module.exports = mongoose.model('Universe', universeSchema);
