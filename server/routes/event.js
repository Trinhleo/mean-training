var router = require('express').Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var eventController = require('../controllers/event.controller.js');
var galleryController = require('../controllers/gallery.controller.js')
var authMiddleware = require('../middlewares/authentication.js');
module.exports = function () {
    router.post('/', authMiddleware.authentication, eventController.createEvent);
    router.get('/', authMiddleware.authentication, eventController.getAllEvents);
    router.get('/myevents', authMiddleware.authentication, eventController.getAllEventsOfUser);
    router.get('/:id', authMiddleware.authentication, eventController.getEventById);
    router.get('/images', authMiddleware.authentication, galleryController.getAllImages);
    router.get('/:id/images', authMiddleware.authentication, galleryController.getAllImagesByEventId);
    router.post('/:id/images', authMiddleware.authentication, galleryController.createImage);
    router.put('/:id', authMiddleware.authentication, eventController.updateEvent);
    router.delete('/:id', authMiddleware.authentication, eventController.deleteEvent);
    return router;
};

