var router = require('express').Router();
var usersController = require('../controllers/users.controller.js');
var eventController = require('../controllers/event.controller.js');
var authMiddleware = require('../middlewares/authentication.js');
module.exports = function () {
    router.get('/me', authMiddleware.authentication, usersController.me);
    router.get('/:id', authMiddleware.authentication, usersController.userInfo);
    router.get('/:id/events', authMiddleware.authentication, eventController.getAllEventsByUserId);
    router.put('/me', authMiddleware.authentication, usersController.updateProfile);
    router.post('/me/picture-profile', authMiddleware.authentication, usersController.changePictureProfile);
    return router;
};