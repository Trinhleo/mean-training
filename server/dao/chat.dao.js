'use strict';
var mongoose = require('mongoose');
require('../models/chat-room.model.js');
var Room = mongoose.model('ChatRoom');
var _ = require('lodash');
module.exports = {
    listAllRooms: listAllRooms,
    listAllRoomsByUserId: listAllRoomsByUserId,
    getRoomById: getRoomById,
    listAttendedUser: listAttendedUser,
    createRoom: createRoom,
    updateRoom: updateRoom,
    deleteRoom: deleteRoom
}

function listAllRooms(userId,callback) {
    Room.find({listBannedUser: {$ne : userId }}).sort('-created').exec(function (err, rooms) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, rooms);
        }
    })
};

function listAllRoomsByUserId(userId, callback) {
    Room.find({ roomHost: userId }).sort('-created').populate({
        path: 'listUserAttend',
        select: 'firstName lastName profileImageURL'
    }).exec(function (err, rooms) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, rooms);
        };
    });
};

function getRoomById(id, callback) {
    Room.findById(id, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        };
    });
};

function listAttendedUser(id, callback) {

    Room.findById(id).populate({
        path: 'listUserAttend',
        select: 'firstName lastName -_id'
    }).exec(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
            console.log(result);
        };
    });
};

function createRoom(roomInfo, callback) {
    var room = new Room(roomInfo);
    room.save(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        };
    });

};
function updateRoom(id, roomInfo, callback) {
    Room.findById(id, function (err, result) {
        if (err || null === result) {
            console.log(err);
            callback(err, null);
        } else {
            var roomUpdated = _.assignIn(result, roomInfo)
            roomUpdated.save(function (err, result) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, true);
                };
            });
        };
    });

};

function deleteRoom(id, callback) {
    console.log("hhh" + id);
    Room.findById(id, function (err, room) {
        if (err) {
            console.log('1' + err);
            callback(err, null);
        } else if (null === room) {
            callback(null, null);
        } else {
            room.remove(function (err, result) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, true);
                };
            });
        };
    });
};