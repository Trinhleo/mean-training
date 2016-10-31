'use strict';
var mongoose = require('mongoose');
require('../models/notification.model.js');
var Notify = mongoose.model('Notification');
var _ = require('lodash');
module.exports = {
    listMyNotification: listMyNotification,
    createNotification: createNotification,
    updateNotification: updateNotification,
    deleteNotification: deleteNotification
}

function listMyNotification(id, callback) {

    Notify.find({ userAdd: id }).sort('-created').populate('userHost', 'firstName lastName profileImageURL').exec(function (err, events) {
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

// function getFavEventByEventId(userId, eventId, callback) {
//     FavEvent.find({
//         userAdd: userId,
//         event: eventId
//     }).sort('-created').exec(function (err, res) {
//         if (err) {
//             console.log(err);
//             return callback(err, null);
//         };
//         if (res.length === 0 || res === []) {
//             callback("not found");
//         } else {
//             callback(null, res);
//             console.log(res);
//         }
//     })
// };

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

function createNotification(noInfo, callback) {

    var notify = new Notify(noInfo);
    notify.save(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

};

function updateNotification(id, noInfo, callback) {

    Notify.findById(id, function (err, result) {
        if (err || null === result) {
            console.log(err);
            callback(err, null);
        } else {
            var info = _.assignIn(result, noInfo)
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

function deleteNotification(notify, callback) {

    Notify.findByIdAndRemove(notify._id, function (err, fav) {
        if (err || !fav) {
            console.log('1' + err);
            return callback(err, null);
        };
        callback(null, true);
    })
};