'use strict';
var mongoose = require('mongoose');
require('../models/follow-event.model.js');
var Follow = mongoose.model('FollowUser');
var _ = require('lodash');
module.exports = {
    listMyFollowerUser: listMyFollowerUser,
    getFollowerByUserId: getFollowerByUserId,
    followUser: followUser,
    unFollowUser: unFollowUser
}

function listMyFollowerUser(id, callback) {
    Follow.find({ userHost: id }).sort('-created').populate('userFollow', 'firstName lastName profileImageURL').exec(function (err, events) {
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

function getFollowerByUserId(userId, eventId, callback) {
    Follow.find({
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

function followUser(flInfo, callback) {

    var fl = new Follow(flInfo);
    fl.save(function (err, result) {
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

function unFollowUser(uflInfo, callback) {

    Follow.find(uflInfo, function (err, fav) {
        if (err || !fav) {
            console.log('1' + err);
            return callback(err, null);
        };

        if (fav.length === 0 || fl === []) {
            callback(false, null);
        } else {
            console.log(fav);
            for (var x in fl) {
                fl[x].remove(function (err, res) {
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