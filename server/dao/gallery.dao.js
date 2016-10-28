'use strict';
var mongoose = require('mongoose');
require('../models/image.model.js');
var Image = mongoose.model('Image');
var _ = require('lodash');
module.exports = {
    listAllImageByUserId: listAllImageByUserId,
    listAllImageByEventId: listAllImageByEventId,
    getImageById: getImageById,
    createImage: createImage,
    updateImage: updateImage,
    deleteImage: deleteImage
};

function listAllImageByUserId(userId, callback) {
    Image.find({ user: userId }).sort('-created').exec(function (err, images) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, images);
        }
    })
};

function listAllImageByEventId(eventId, callback) {
    Image.find({ event: eventId }).sort('-created').exec(function (err, images) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, images);
        }
    })
};

function getImageById(id, callback) {
    Image.findById(id, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

// function readImage(id, callback) {
//     // find the image
//     User.findOne({
//         username: user.username
//     }, function (err, result) {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// };

function createImage(image, callback) {
    console.log(image);
    var img = new Image(image);
    img.save(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

};
function updateImage(id, image, callback) {
    console.log(image);
    Image.findById(id, function (err, result) {
        if (err || null === result) {
            console.log(err);
            callback(err, null);
        } else {
            var imgInfo = _.assignIn(result, image)
            imgInfo.save(function (err, result) {
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

function deleteImage(id, callback) {
    console.log("hhh" + id);
    Image.findById(id, function (err, image) {
        if (err) {
            console.log('1' + err);
            callback(err, null);
        } else if (null === image) {
            callback(null, null);
        } else {
            image.remove(function (err, result) {
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