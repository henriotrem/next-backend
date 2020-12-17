const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const sourceSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    description: { type: String}
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

sourceSchema.plugin(mongoosePaginate);
sourceSchema.index({userId:1, name: 1}, {unique: true});

module.exports = mongoose.model('Source', sourceSchema);
