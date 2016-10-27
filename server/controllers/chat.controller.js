var chatDao = require('./../dao/chat.dao');
var multer = require('multer');
var path = require('path');
var fs = require('fs-extra');
var mongoose = require('mongoose');

const galleryPath = './uploads/gallery/';
const hostName = 'http://localhost:';
const port = 3000;
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
    getAllRooms: getAllRooms,
    getAllRoomsByUserId: getAllRoomsByUserId,
    banNick: banNick,
    joinRoom: joinRoom,
    createRoom: createRoom,
    updateRoom: updateRoom,
    deleteRoom: deleteRoom
};

function getAllRooms(req, res) {
    chatDao.listAllRooms(function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function getAllRoomsByUserId(req, res) {
    var id = req.decoded._id;
    chatDao.listAllRoomsByUserId(id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function banNick(req, res) {
    var hostId = req.decoded._id;
    var roomId = req.params.id;
    var bannedId = mongoose.Types.ObjectId(req.body.bannedId);
    if (!mongoose.Types.ObjectId.isValid(bannedId)) {
        return res.status(400).send({
            message: "please check input!"
        });
    };
    // } else if () {
    //     bannedId = mongoose.Types.ObjectId(req.body.bannedId)
    //     console.log(bannedId);
    // }
    chatDao.getRoomById(roomId, function (err, result) {
        if (err) {
            res.status(500).send({
                message: "internal error!"
            });
        } else if (null === result) {
            res.status(400).send({
                message: "Room is not exist!"
            });
        } else {
            result.listBannedNick.push(bannedId);
            console.log(result);
            chatDao.updateRoom(roomId, result, function (err, result) {
                if (err) {
                    res.status(500).send(
                        {
                            message: "internal error!"
                        }
                    );
                } else {
                    res.status(200).send({
                        message: "nick has banned!"
                    })
                }
            })
        }
    });
};

function joinRoom(req, res) {

    chatDao.getRoomById(req.params.id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });

};

function createRoom(req, res) {
    var roomInfo = {
        name: req.body.name,
        roomHost: req.decoded._id
    };
    chatDao.createRoom(roomInfo, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        };
    })
};

function updateRoom(req, res) {

};

function deleteRoom(req, res) {
    console.log(req);
    chatDao.deleteRoom(req.params.id, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else if (null === result) {
            res.status(403).send("Room not found!");
        } else {
            res.status(200).send("Room is deleted!");
        };
    });
};
