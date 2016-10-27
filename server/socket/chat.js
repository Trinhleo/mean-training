var _ = require('lodash');
var mongoose = require('mongoose');
var chatDao = require('../dao/chat.dao');
var userDao = require('../dao/user.dao');
var messageDao = require('../dao/message.dao');
var loadmessages = loadMessages;
var loadrooms = loadRooms;
var loadmyRooms = loadMyRooms;
var checkroomHost = checkRoomHost;
var updateOnlineList = onlineList;
var checkuser = checkUser;
module.exports = {
    loadRooms: loadRooms,
    init: init,
    createRoom: createRoom,
    deleteRoom: deleteRoom,
    editRoom: editRoom,
    myRoom: myRoom,
    joinRoom: joinRoom,
    sendMessage: sendMessage,
    leaveRoom: leaveRoom,
    ban: ban
};

function loadMessages(socket, roomId, lm) {
    messageDao.listAllMessageByRoomId(roomId, lm, callback);
    function callback(err, result) {
        if (err) {
            return socket.emit('load messages', {
                message: err
            })
        };
        socket.emit('load messages', result);
    }
};

function loadRooms(socket) {
    var socket = socket;
    var userId = mongoose.Types.ObjectId(socket.user._id);
    chatDao.listAllRooms(userId, load);
    function load(err, result) {
        if (err) {
            return socket.emit('load rooms', {});
        };
        var rooms = result;

        socket.emit('load rooms', rooms);
    };
};

function loadMyRooms(socket) {
    var socket = socket;
    chatDao.listAllRoomsByUserId(socket.user._id, load);
    function load(err, result) {
        if (err) {
            return socket.emit('load myrooms', {});
        };
        //need refactor later
        var res = result;
        console.log(res);

        socket.emit('load myrooms', res);
    };
};

// send the user on connection
function init(socket) {

    loadrooms(socket);
    loadmyRooms(socket);

};


// create room chat
function createRoom(socket, roomInfo) {
    chatDao.createRoom(roomInfo, callback);
    function callback(err, result) {
        if (err) {

            var errmsg = "";
            if (err.code === 11000) {
                errmsg = "room name has exist!"
            } else {
                errmsg = "internal error! can not create new room!"
            }
            console.log(errmsg);
            return socket.emit('create room', errmsg);
        };

        socket.emit('create room', result.name + "has created succesfully!");
        socket.broadcast.emit('update room');
        loadrooms(socket, true);
        loadmyRooms(socket);

    };


};
// delete room chat
function deleteRoom(socket, roomId) {
    checkroomHost(socket, {
        _id: roomId
    }, cb)
    function cb(err, result) {
        if (err) {
            socket.emit('alert', {
                user: {
                    nickname: 'SERVER'
                },
                message: "You are not the host of this room!"
            });
            return socket.disconnect('unauthorized');
        };
        chatDao.deleteRoom(roomId, callback);
        function callback(err, result) {
            if (err) {
                var errmsg = "";
                if (err.code === 11000) {
                    errmsg = "room name has exist!"
                } else {
                    errmsg = "internal error! can not delete room!"
                }
                console.log(errmsg);
                return socket.emit('delete room', errmsg);
            };
            socket.emit('delete room', "has deleted succesfully!");
            socket.broadcast.emit('update room');
            loadrooms(socket, true);
            loadmyRooms(socket);
        };
    };
};

// edit room
function editRoom(socket, roomInfo) {
    checkroomHost(socket, roomInfo, cb)
    function cb(err, result) {
        if (err) {
            socket.emit('alert', {
                user: {
                    nickname: 'SERVER'
                },
                message: "You are not the host of this room!"
            });
            return socket.disconnect('unauthorized');
        };
        chatDao.updateRoom(roomInfo._id, roomInfo, callback);
        function callback(err, result) {
            if (err) {
                var errmsg = "";
                if (err.code === 11000) {
                    errmsg = "room name has exist!"
                } else {
                    errmsg = "internal error! can not edit room!"
                }
                console.log(errmsg);
                return socket.emit('edit room', errmsg);
            };
            socket.emit('edit room', "updated succesfully!");
            socket.broadcast.emit('update room');
            loadrooms(socket);
            loadmyRooms(socket);
        };
    };
};
// get all of my rooms
function myRoom(socket) {
    loadmyRooms(socket);
};

// update visitors list for everyone
function joinRoom(io, socket, room) {
    checkuser(socket, room, jrCb);
    function jrCb(notValid, valid) {
        if (notValid) {
            return socket.emit('alert', {
                user: {
                    nickname: 'SERVER'
                },
                message: "You has been banned in this room!"
            });
        };

        processJoinRoom(io, socket);
    };

    function processJoinRoom(io, socket) {
        var userInfo = socket.user;
        delete userInfo.email;
        delete userInfo.firstName;
        delete userInfo.lastName;
        userInfo.sid = socket.id;
        socket.room = room._id;
        // socket.roomName = room.name;
        socket.join(room._id);

        // load 30 lastest message
        updateOnlineList(io, socket);
        loadmessages(socket, room._id, 5);

        socket.emit('join', {
            user: {
                nickname: 'SERVER'
            },
            message: 'you have connected to ' + room.name
        });

        socket.broadcast.to(socket.room).emit('join', {
            user: {
                nickname: 'SERVER'
            },
            message: userInfo.nickname + ' has connected to this room',
            userInfo: userInfo
        });
        var listAttend = room.listUserAttend;
        var roomHost = room.roomHost;
        console.log('---roomHost---');
        console.log(roomHost);
        if (listAttend.indexOf(socket.user._id) === -1 && socket.user._id.toString() !== roomHost.toString()) {

            listAttend.push(socket.user._id);
        };

        chatDao.updateRoom(room._id, { listUserAttend: listAttend }, udCb);
        function udCb(err, result) {
            if (err) {
                return console.log(err);
            };
            console.log(result)
        };
    };
};


// broadcast user's message to other users
function sendMessage(io, socket, data) {

    if (!socket.room) {
        return socket.emit('alert', {
            user: {
                nickname: 'SERVER'
            },
            message: "You has been banned in this room!"
        });
    };

    checkUser(socket, { _id: socket.room }, cb);
    function cb(err, result) {
        if (err) {
            return socket.emit('alert', {
                user: {
                    nickname: 'SERVER'
                },
                message: "You has been banned in this room!"
            });
        };

        var msg = {
            room: socket.room,
            message: data,
            user: socket.user._id
        }
        //save message to db
        messageDao.createMessage(msg, callback);
        function callback(err, result) {
            if (err) {
                return console.log(err);
            };
        }

        io.sockets.in(socket.room).emit('chat message', {
            message: data,
            user: {
                nickname: socket.user.nickname,
                avatar: socket.user.profileImageURL
            }
        });
    };

};

// clean up when a user leaves, and broadcast to other users
function leaveRoom(io, socket) {
    if (socket.room) {
        socket.broadcast.to(socket.room).emit('leave', {
            user: {
                nickname: 'SERVER'
            },
            message: socket.user.nickname + ' has leave this room',
            userLeaveId: socket.user._id
        });
        socket.leaveAll();
        delete socket.room;
    }
};

// ban nick 
function ban(sio, socket, userRoom, userBan) {
    var io = sio;
    var bannedUser = userBan;
    var room = userRoom;
    checkroomHost(socket, room, callback);
    function callback(err, result) {
        if (err) {
            socket.emit('alert', {
                user: {
                    nickname: 'SERVER'
                },
                message: "You are not the host of this room!"
            });
            return socket.disconnect('unauthorized');
        };

        if (bannedUser._id.toString() === socket.user._id.toString()) {
            return socket.emit('ban', {
                user: {
                    nickname: 'SERVER'
                },
                message: "cannot ban this user!"
            });
        };


        result.listBannedUser.push(bannedUser._id)
        chatDao.updateRoom(room._id, result, cb);
        function cb(err, result) {
            if (err) {
                return socket.emit('ban', {
                    user: {
                        nickname: 'SERVER'
                    },
                    message: "cannot ban this user!"
                });
            };

            socket.emit('ban', {
                user: {
                    nickname: 'SERVER'
                },
                message: "that user has been banned!"
            });
            //check if user are connected
            var userSid = bannedUser.sid ? bannedUser.sid : null;
            var userNickName = bannedUser.nickname || "";
            if (userSid && io.nsps['/'].adapter.rooms[room._id] && null !== userSid && io.nsps['/'].adapter.rooms[room._id].sockets.hasOwnProperty(userSid)) {
                // kick user out of room
                io.of('/').adapter.del(userSid, room._id);
                io.nsps['/'].sockets[userSid].emit('banned alert', {
                    user: {
                        nickname: 'SERVER'
                    },
                    message: 'you has been banned'
                });
                socket.emit('leave', {
                    user: {
                        nickname: 'SERVER'
                    },
                    message: userNickName + ' has leave this room',
                    userLeaveId: bannedUser._id
                });
                socket.broadcast.to(socket.room).emit('leave', {
                    user: {
                        nickname: 'SERVER'
                    },
                    message: userNickName + ' has leave this room',
                    userLeaveId: bannedUser._id
                });
                io.nsps['/'].sockets[userSid].emit('update rooms');
            } else {
                io.nsps['/'].emit('update rooms');
                console.log("Socket not connected");
            };
        }
    }
};

// middleware check room host
function checkRoomHost(socket, room, cb) {
    console.log('check room host');
    try {
        var userId = mongoose.Types.ObjectId(socket.user._id);
    }
    catch (err) {
        console.log(err)
        return cb(0, null);
    };

    chatDao.getRoomById(room._id, callback);
    function callback(err, result) {
        if (err || (null === result)) {
            return socket.disconnect('unauthorized');
        };

        var roomHostId = result.roomHost;
        var listBanned = result.listBanned;
        if (roomHostId.toString() === userId.toString()) {
            cb(null, result);
        } else {
            cb(1, null);
        };
    };
};

// middleware check weather user in listBanned
function checkUser(socket, room, cb) {
    try {
        var userId = mongoose.Types.ObjectId(socket.user._id);
    }
    catch (err) {
        console.log(err)
        return cb(0, null);
    };
    chatDao.getRoomById(room._id, getRomCb);
    function getRomCb(err, result) {

        if (err || (null === result)) {
            return socket.disconnect('unauthorized');
        };
        var listBanned = result.listBannedUser;
        if (listBanned.indexOf(userId) !== -1 || listBanned.indexOf(userId.toString()) !== -1) {
            cb(1, null);
        } else {
            cb(null, true);
        };
    };
};

function onlineList(io, socket) {
    var onlineList = [];
    var room = socket.room;
    var sockets = io.nsps['/'].sockets;
    var socketsArr = Object.keys(io.nsps['/'].sockets);

    if (socket && (!socket.room)) {
        return;
    }
    var online = io.nsps['/'].adapter.rooms[room] ? Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : undefined;
    if (online) {
        for (var x in online) {
            if (online[x].toString() !== socket.id.toString()) {
                var obj = sockets[online[x].toString()].user;
                delete obj.email;
                delete obj.firstName;
                delete obj.lastName;
                obj.sid = online[x];
                onlineList.push(obj);
            }
        };
    };

    socket.emit('online', onlineList);
};
