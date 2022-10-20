const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;
const CONFIG = require('../config');
const UserSchema = new Schema({
    username: {
        type: String,
    },

    email: {
        type: String,
    },

    email_status: {
        type: String,
        enum: ['Confirmed', 'Unconfirmed'],
        default: 'Unconfirmed',
    },
    personal_information: {
        full_name: {
            type: String,
        },

        _address: {
            type: ObjectId,
            ref: 'Address',
        },
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Inactive'],
    },
    type: {
        type: String,
        enum: CONFIG.settings.account_type,
    },
    _owner: {
        type: ObjectId,
        ref: 'User',
    },
    _counter: {
        type: ObjectId,
        ref: 'Counter',
    },
    password_hash: {
        type: String,
    },
    news_lettre: {
        type: Boolean,
        default: false,
    },
    last_authentication_date: {
        type: Date,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    provider: {
        type: String,
        enum: CONFIG.settings.provider_type,
    },
    car_winner: {
        type: Boolean,
        default: false,
    },
    car_winner_date: {
        type: Date,
    },
    creation_ip: {
        type: String,
    },
});

module.exports = mongoose.model('User', UserSchema);
