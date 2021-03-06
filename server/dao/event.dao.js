'use strict';
var mongoose = require('mongoose');
require('../models/event.model.js');
var Event = mongoose.model('Event');
var _ = require('lodash');
module.exports = {
    listAllEvents: listAllEvents,
    listAllEventsByUserId: listAllEventsByUserId,
    getEventById: getEventById,
    createEvent: createEvent,
    updateEvent: updateEvent,
    deleteEvent: deleteEvent
}

function listAllEvents(callback) {

    Event.find({ endTime: { $gt: new Date } }).sort('-created').populate('userHost', 'firstName lastName profileImageURL').exec(function (err, events) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log(events);
            callback(null, events);
            // console.log(events[0].endTime);
            // console.log(events[0].endTime > new Date());
            // console.log(new Date());
        };
    });
};

function listAllEventsByUserId(userId, callback) {
    Event.find({ userHost: userId }).populate('userHost', 'firstName lastName profileImageURL').sort('-created').exec(function (err, Events) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, Events);
        }
    })
};

function getEventById(id, callback) {
    Event.findById(id).populate('userHost', 'firstName lastName profileImageURL').exec(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        };
    });
};

function createEvent(eventInfo, callback) {
    console.log(Event);
    var event = new Event(eventInfo);
    event.save(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

};
function updateEvent(id, eventInfo, callback) {
    console.log(eventInfo);
    Event.findById(id, function (err, result) {
        if (err || null === result) {
            console.log(err);
            callback(err, null);
        } else {
            var info = _.assignIn(result, eventInfo)
            console.log(info);
            info.save(function (err, result) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, true);
                }
            });
        }
    })

};

function deleteEvent(id, callback) {
    console.log("hhh" + id);
    Event.findById(id, function (err, event) {
        if (err) {
            console.log('1' + err);
            callback(err, null);
        } else if (null === event) {
            callback(null, null);
        } else {
            event.remove(function (err, result) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, true);
                }
            });
        }
    })
};