'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var MessageSchema = new Schema({
    room: {
        type: Schema.ObjectId,
        ref: 'ChatRoom',
        require: true
    },
    message: {
        type: String,
        require: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        require: true
    },
    creationDate: { type: 'Date', default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);