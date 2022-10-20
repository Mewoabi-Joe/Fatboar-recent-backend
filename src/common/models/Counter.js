const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const CounterSchema = new Schema({
    _owner: {
        type: ObjectId,
        ref: 'User',
    },
    number: {
        type: Number,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Started', 'Ended'],
    },
    update_date: {
        type: Date,
    },
});

module.exports = mongoose.model('Counter', CounterSchema);
