'use strict';
var mongoose = require('mongoose');
require('../models/favorite-event.model.js');
var FavEvent = mongoose.model('FavoriteEvent');
var _ = require('lodash');
module.exports = {
    listMyFavEvents: listMyFavEvents,
    getFavEventByEventId: getFavEventByEventId,
    createFavEvent: createFavEvent,
    deleteFavEvent: deleteFavEvent
}

function listMyFavEvents(id, callback) {

    FavEvent.find({ userAdd: id }).sort('-created').populate('userHost', 'firstName lastName profileImageURL').exec(function (err, events) {
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

function getFavEventByEventId(userId, eventId, callback) {
    FavEvent.find({
        userAdd: userId,
        event: eventId
    }).sort('-created').exec(function (err, res) {
        if (err) {
            console.log(err);
            return callback(err, null);
        };
        if (res.length === 0 || res === []) {
            callback("not found");
        } else {
            callback(null, res);
            console.log(res);
        }
    })
};

// function getEventById(id, callback) {
//     Event.findById(id).populate('userHost', 'firstName lastName profileImageURL').exec(function (err, result) {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         };
//     });
// };

function createFavEvent(eventFavInfo, callback) {

    var event = new FavEvent(eventFavInfo);
    event.save(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

};

// function updateEvent(id, eventInfo, callback) {
//     console.log(eventInfo);
//     Event.findById(id, function (err, result) {
//         if (err || null === result) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             var info = _.assignIn(result, eventInfo)
//             console.log(info);
//             info.save(function (err, result) {
//                 if (err) {
//                     console.log(err);
//                     callback(err, null);
//                 } else {
//                     callback(null, true);
//                 }
//             });
//         }
//     })

// };

function deleteFavEvent(favEvent, callback) {

    FavEvent.find(favEvent, function (err, fav) {
        if (err || !fav) {
            console.log('1' + err);
            return callback(err, null);
        };

        if (fav.length === 0 || fav === []) {
            callback(false, null);
        } else {
            console.log(fav);
            for (var x in fav) {
                fav[x].remove(function (err, res) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    };

                });
            };
            callback(null, true);
        }
    })
};