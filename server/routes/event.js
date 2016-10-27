var router = require('express').Router();
var eventController = require('../controllers/event.controller.js');
var authMiddleware = require('../middlewares/authentication.js');
module.exports = function () {
    router.post('/', authMiddleware.authentication, eventController.createEvent);
    router.get('/', authMiddleware.authentication, eventController.getAllEvents);
    router.get('/myevents', authMiddleware.authentication, eventController.getAllEventsOfUser);
    router.get('/:id', authMiddleware.authentication, eventController.getEventById);
    router.put('/:id', authMiddleware.authentication, eventController.updateEvent);
    router.delete('/:id', authMiddleware.authentication, eventController.deleteEvent);
    return router;
};