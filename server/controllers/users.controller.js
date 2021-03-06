var userDao = require('./../dao/user.dao');
var multer = require('multer');
var path = require('path');
var fs = require('fs-extra');
const fileField = 'myfile';
const profileImgPath = './uploads/profile/';
const hostName = 'http://localhost:';
const port = 3000;
const profileImgPathUrl = '/profile/';
const maxImgFileSize = 1024 * 1024;
module.exports = {
    me: getMyUserInfo,
    userInfo: getUserInfo,
    updateProfile: updateProfile,
    changePictureProfile: changePictureProfile
};

function getMyUserInfo(req, res) {
    var id = req.decoded._id;
    userDao.readUserById(id, function (err, result) {
        console.log(result);
        if (err || null === result) {
            console.log(err);
            res.status(400).send();
        } else {
            var userInfo = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                creationDate: result.creationDate,
                profileImageURL: result.profileImageURL
            };
            res.status(200).send(userInfo);
        }
    });
};

function getUserInfo(req, res) {
    var id = req.params.id;
    userDao.readUserById(id, function (err, result) {
        console.log(result);
        if (err || null === result) {
            console.log(err);
            res.status(400).send();
        } else {
            var userInfo = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                creationDate: result.creationDate,
                profileImageURL: result.profileImageURL
            };
            res.status(200).send(userInfo);
        }
    });
};
function updateProfile(req, res) {
    var id = req.decoded._id;
    userDao.updateUser(id, req.body, function (err, result) {
        console.log(result);
        if (err || null === result) {
            console.log(err);
            res.status(400).send();
        } else {
            console.log(result);
            res.status(200).send("success");
        }
    });
};
function changePictureProfile(req, res) {
    var id = req.decoded._id;
    var dir = profileImgPath + id;
    var imgUrl = profileImgPathUrl + id;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })

    var upload = multer({
        storage: storage,
        limits: { fileSize: maxImgFileSize }
    }).single(fileField);

    // make dir and upload
    fs.mkdirs(dir, function (err) {
        if (err) {
            res.status(500).send('cannot make dir!');
        } else {
            upload(req, res, function (uploadError) {
                console.log(req.file);
                if (!req.file) {
                    return res.status(403).send("file not found or file is more large!");
                };
                if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/gif') {
                    return res.status(403).send("not image format!");
                };
                if (uploadError) {
                    console.log(uploadError);
                    return res.status(400).send({
                        message: 'error in uploading /n' + uploadError
                    });
                };

                var user = {
                    profileImageURL: hostName + port + imgUrl + "/" + req.file.filename
                };
                console.log(dir);
                userDao.updateUser(id, user, function (err, result) {
                    console.log(result);
                    if (err) {
                        console.log(err);
                        res.status(400).send();
                    } else {
                        console.log(result);
                        res.status(200).send("success uploading image!");
                    }
                });
            });
        }
    })
};