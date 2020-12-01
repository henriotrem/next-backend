const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    firstname:{type: String, required: true},
    lastname:{type: String, required: true},
    segments: {
        updatedAt: {type: Date, default: Date.now},
        inProgress: {type: Boolean, default: false}
    }
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
