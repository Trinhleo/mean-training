var router = require('express').Router();
var chatController = require('../controllers/chat.controller.js');
var authMiddleware = require('../middlewares/authentication.js');
module.exports = function () {
    router.get('/rooms', authMiddleware.authentication, chatController.getAllRooms);
    router.get('/myrooms', authMiddleware.authentication, chatController.getAllRoomsByUserId);
    router.post('/rooms', authMiddleware.authentication, chatController.createRoom);
    router.get('/rooms/:id', authMiddleware.authentication, chatController.joinRoom);
    router.put('/rooms/:id', authMiddleware.authentication, chatController.updateRoom);
    router.post('/rooms/:id/ban', authMiddleware.authentication, chatController.banNick);
    router.delete('/rooms/:id', authMiddleware.authentication, chatController.deleteRoom);
    return router;
};