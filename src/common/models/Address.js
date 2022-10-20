const mongoose = require('mongoose');

const { Schema } = mongoose;

const AddressSchema = new Schema({
    full_name: {
        type: String,
    },
    address1: {
        type: String,
    },
    address2: {
        type: String,
    },
    zip: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    creation_ip: {
        type: String,
    },
});

module.exports = mongoose.model('Address', AddressSchema);
