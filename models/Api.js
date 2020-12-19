const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const apiSchema = mongoose.Schema({
    userId: {type: mongoose.ObjectId, ref: 'User', required: true},
    sourceId: {type: mongoose.ObjectId, ref: 'Source', required: true},
    email: { type: String },
    token: { type: String },
    refreshToken: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

apiSchema.plugin(mongoosePaginate);
apiSchema.index({userId:1, sourceId:1, email: 1}, {unique: true});

module.exports = mongoose.model('Api', apiSchema);
