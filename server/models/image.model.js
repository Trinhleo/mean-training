'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ImageSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    event: {
        type: Schema.ObjectId,
        ref: 'Event'
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    imgUrl: {
        type: String,
        default: ''
    }
});
module.exports = mongoose.model('Image', ImageSchema);
