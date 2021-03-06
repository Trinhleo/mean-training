'use strict';
var mongoose = require('mongoose');
require('../models/user.model.js');
var User = mongoose.model('User');
var _ = require('lodash');
module.exports = {
    readUserById: readUserById,
    readUser: readUser,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser
}

function readUserById(id, callback) {
    User.findById(id, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

function readUser(user, callback) {
    var user = user;
    // find the user
    User.findOne({
        username: user.username
    }, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

function createUser(creditial, callback) {
    console.log(creditial);
    var user = new User(creditial);

    user.save(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

};
function updateUser(id, creditial, callback) {
    console.log(creditial);
    User.findById(id, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            var userInfo = _.assignIn(result, creditial)
            userInfo.save(function (err, result) {
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

function deleteUser(id, callback) {

};