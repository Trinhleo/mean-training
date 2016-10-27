var router = require('express').Router();
var usersController = require('../controllers/users.controller.js');
var authMiddleware = require('../middlewares/authentication.js');
module.exports = function () {
    router.get('/me', authMiddleware.authentication, usersController.me);
    router.put('/me', authMiddleware.authentication, usersController.updateProfile);
    router.post('/me/picture-profile', authMiddleware.authentication, usersController.changePictureProfile);
    return router;
};