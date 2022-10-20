const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const UserVerificationTokenSchema = new Schema({
    _user: {
        type: ObjectId,
        ref: 'User',
    },
    token_hash: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Valid', 'Used'],
    },
    type: {
        type: String,
        enum: ['ResetPassword', 'Email'],
    },
    expiration_date: {
        type: Date,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('UserVerificationToken', UserVerificationTokenSchema);
