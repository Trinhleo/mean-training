var express = require('express');
var _ = require('underscore');
var chatCtrl = require('../socket/event-chat');
var checkAuthToken = require('../services/jwt.ultil');
module.exports = function (io, app) {
    _.each(io.nsps, function (nsp) {
        nsp.on('connect', function (socket) {
            if (!socket.auth) {
                console.log("removing socket from", nsp.name)
                delete nsp.connected[socket.id];
            }
        });
    });

    io.sockets.on('connection', authentication);
    //authentication
    function authentication(socket) {
        socket.auth = false;
        socket.on('authenticate', function (data) {
            //check the auth data sent by the client
            checkAuthToken.verifyToken(data.token, function (err, success) {
                if (!err && success) {
                    console.log("Authenticated socket ", socket.id);
                    socket.auth = true;
                    socket.user = success;
                    socket.user.nickname = success.firstName.concat(success.lastName);

                    _.each(io.nsps, function (nsp) {
                        if (_.findWhere(nsp.sockets, { id: socket.id })) {
                            console.log("restoring socket to", nsp.name);
                            nsp.connected[socket.id] = socket;
                        }
                    });
                    authenSuccess(io, socket);
                }
            });
        });

        setTimeout(function () {
            //If the socket didn't authenticate, disconnect it
            if (!socket.auth) {
                console.log("Disconnecting socket ", socket.id);
                socket.disconnect('unauthorized');
            }
        }, 3000);
    }
};
//when authenticate successful
function authenSuccess(io, socket) {

    socket.on('signin', function () {
     
    });

    socket.on('new event', function () {
        io.emit('load event');
    })

    socket.on('join', function (room) {
        if (socket.room) {
            chatCtrl.leaveRoom(io, socket);
        };
        chatCtrl.joinRoom(io, socket, room);
    });

    socket.on('chat message', function (data) {
        chatCtrl.sendMessage(io, socket, data);
    });

    socket.on('leave', function () {
        chatCtrl.leaveRoom(io, socket);
    });

    socket.on('disconnect', function onDisconnect() {
        chatCtrl.leaveRoom(io, socket);
    });

};
