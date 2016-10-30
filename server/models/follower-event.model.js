'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FollowEventSchema = new Schema({
    userHost: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    userFollow: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Indexes this schema in geoJSON format (critical for running proximity searches)

module.exports = mongoose.model('FollowEvent', FollowEventSchema);
