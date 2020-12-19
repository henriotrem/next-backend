const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const providerSchema = mongoose.Schema({
    label: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    endpoint: { type: String, required: true },
    description: { type: String},
    clientSecret: { type: String },
    clientId: { type: String },
    callbackUrl: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

providerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Provider', providerSchema);
