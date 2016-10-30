var galleryDao = require('./../dao/gallery.dao');
var multer = require('multer');
var path = require('path');
var fs = require('fs-extra');
const fileField = 'myfile';
const galleryPath = './uploads/gallery/';
const hostName = 'http://localhost:';
const port = 3000;
const galleryPathUrl = '/gallery/';
const maxImgFileSize = 1024 * 1024;
module.exports = {
    getAllImages: getAllImages,
    getAllImagesByEventId: getAllImagesByEventId,
    getAllImagesByUserId: getAllImagesByUserId,
    createImage: createImage,
    updateImage: updateImage,
    deleteImage: deleteImage
};

function getAllImages(req, res) {
    var id = req.decoded._id;
    galleryDao.listAllImageByUserId(id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function getAllImagesByEventId(req, res) {
    galleryDao.listAllImageByEventId(req.params.id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function getAllImagesByUserId(req, res) {
    var id = req.params.id;
    galleryDao.listAllImageByUserId(id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};


function createImage(req, res) {
    console.log('im here');
    var eventId = req.params.id;
    var id = req.decoded._id;
    var dir = galleryPath + id;
    var imgUrl = hostName + port + galleryPathUrl + id;
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
                if (!req.file) {
                    return res.status(403).send("file not found or file is more large!");
                };
                if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/gif') {
                    return res.status(403).send("not image format!");
                };
                if (uploadError) {
                    console.log(uploadError);
                    return res.status(400).send({
                        message: 'error in uploading'
                    });
                };
                var image = {
                    user: id,
                    name: req.body.name,
                    imgUrl: imgUrl + "/" + req.file.filename
                };
                if (eventId) {
                    image.event = eventId;
                };
                galleryDao.createImage(image, function (err, result) {
                    console.log(result);
                    if (err || null === result) {
                        console.log(err);
                        res.status(400).send();
                    } else {
                        console.log(result);
                        res.status(200).send({
                            imgUrl: result.imgUrl
                        });
                    }
                });
            }
            );
        }
    })
};

function updateImage(req, res) {

};

function deleteImage(req, res) {
    console.log(req);
    galleryDao.deleteImage(req.params.id, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else if (null === result) {
            res.status(403).send("image not found!");
        } else {
            res.status(200).send("image is deleted!");
        };
    });
};
