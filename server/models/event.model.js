'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var EventSchema = new Schema({
    userHost: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: [Number],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: '',
        trim: true,

    },
    startTime: {
        type: Date,
        default: Date.now,
        require: true
    },
    endTime: {
        type: Date,
        default: Date.now,
        require: true
    },
    imgAlbum: [{
        type: String
    }],
    imgUrl: {
        type: String,
        default: 'http://localhost:3000/gallery/5808afb003609a0efcceb85d/1477563545213-trolltunga.jpg'
    }
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
EventSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Event', EventSchema);
