'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FavoriteEventSchema = new Schema({
    userHost: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    userAdd: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: Schema.ObjectId,
        ref: 'Event',
        required: true
    }
});

// Indexes this schema in geoJSON format (critical for running proximity searches)

module.exports = mongoose.model('FavoriteEvent', FavoriteEventSchema);
