'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    firstName: {
        type: 'String',
        required: true
    },
    lastName: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true,
        index: true,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        default: ''
    },
    profileImageURL: {
        type: String,
        default: ''
    },
    creationDate: { type: 'Date', default: Date.now }
});

UserSchema.index({ "username": 1, "email": 1 }, { unique: true });
module.exports = mongoose.model('User', UserSchema);