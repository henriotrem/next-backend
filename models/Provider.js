const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const providerSchema = mongoose.Schema({
    label: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String},
    endpoint: { type: String, required: true },
    clientSecret: { type: String },
    clientId: { type: String },
    callbackUrl: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

providerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Provider', providerSchema);
