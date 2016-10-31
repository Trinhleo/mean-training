'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FollowUserSchema = new Schema({
    userHost: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    userFollow: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

// Indexes this schema in geoJSON format (critical for running proximity searches)

module.exports = mongoose.model('FollowUser', FollowUserSchema);
