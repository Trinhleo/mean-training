'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ChatRoomSchema = new Schema({
    name: {
        type: 'String',
        required: true,
        index: true,
        unique: true
    },
    roomHost: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    listBannedUser: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    listUserAttend: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    creationDate: { type: 'Date', default: Date.now }
});

ChatRoomSchema.index({ "name": 1 }, { unique: true })
module.exports = mongoose.model('ChatRoom', ChatRoomSchema);