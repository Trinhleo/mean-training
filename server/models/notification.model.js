'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var NotificationSchema = new Schema({
    userReceive: {
        type: Schema.ObjectId,
        ref: 'ChatRoom',
        require: true
    },
    userSend: {
        type: Schema.ObjectId,
        ref: 'ChatRoom',
        require: true
    },
    type: {
        type: Number
    },
    content: {
        type: String,
        require: true
    },
    isRead: {
        type: Boolean,
        defaul: false
    },
    creationDate: { type: 'Date', default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);