const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const TicketSchema = new Schema({
    _owner: {
        type: ObjectId,
        ref: 'User',
    },
    _user: {
        type: ObjectId,
        ref: 'User',
    },
    _counter: {
        type: ObjectId,
        ref: 'Counter',
    },
    token: {
        type: String,
    },
    award: {
        type: Number,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    number: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Used'],
    },
    update_date: {
        type: Date,
    },
    expiration: {
        type: Date,
    },
});

module.exports = mongoose.model('Ticket', TicketSchema);
