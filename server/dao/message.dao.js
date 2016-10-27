'use strict';
var mongoose = require('mongoose');
require('../models/Message.model.js');
var Message = mongoose.model('Message');
var _ = require('lodash');
module.exports = {
    listAllMessageByUserId: listAllMessageByUserId,
    listAllMessageByRoomId: listAllMessageByRoomId,
    getMessageById: getMessageById,
    createMessage: createMessage,
    updateMessage: updateMessage,
    deleteMessage: deleteMessage
}

function listAllMessageByUserId(userId, lm, callback) {
    Message.find(userId).sort('-created').limit(lm).exec(function (err, Messages) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, Messages);
        }
    })
};


function listAllMessageByRoomId(roomId, lm, callback) {
    Message.find({ room: roomId }).sort('-created').limit(lm)
        .populate('user', 'firstName lastName profileImageURL').exec(function (err, Messages) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, Messages);
            }
        })
};

function getMessageById(id, callback) {
    Message.findById(id, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

function createMessage(msg, callback) {
    console.log(msg);
    var msg = new Message(msg);
    msg.save(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

};
function updateMessage(id, Message, callback) {


};

function deleteMessage(id, callback) {

};