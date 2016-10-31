var eventDao = require('./../dao/event.dao');
module.exports = {
    getAllEvents: getAllEvents,
    getAllEventsByUserId: getAllEventsByUserId,
    getEventById: getEventById,
    getAllEventsOfUser: getAllEventsOfUser,
    createEvent: createEvent,
    updateEvent: updateEvent,
    deleteEvent: deleteEvent
};

function getAllEvents(req, res) {
    var id = req.decoded._id;
    eventDao.listAllEvents(function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function getAllEventsByUserId(req, res) {
    var id = req.params.id;
    eventDao.listAllEventsByUserId(id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function getEventById(req, res) {
    var id = req.params.id;
    eventDao.getEventById(id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
            console.log(result);
        }
    });
};

function getAllEventsOfUser(req, res) {
    var id = req.decoded._id;
    eventDao.listAllEventsByUserId(id, function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function createEvent(req, res) {
    if (!req.body.location || !req.body.name || !req.body.address) {
        return res.status(403).send({
            message: "error input information!"
        });
    };
    var event = {
        userHost: req.decoded._id,
        location: req.body.location,
        name: req.body.name || "",
        startTime: req.body.startTime || Date.now(),
        endTime: req.body.endTime || Date.now(),
        address: req.body.address || ""
    }
    eventDao.createEvent(event, function (err, result) {
        console.log(result);
        if (err || null === result) {
            console.log(err);
            res.status(400).send();
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
};

function updateEvent(req, res) {
    var userId = req.decoded._id.toString();
    var eventId = req.params._id || req.body._id;
    eventDao.getEventById(eventId, function (err, result) {
        if (err) {
            return res.status(500).send('internal error!');
        };
        if (null === result) {
            return res.status(403).send('you are not host this event!');
        };
        console.log(result);
        if (userId !== result.userHost._id.toString()) {
            return res.status(403).send('you are not host this event!');
        };
        var eventInfo = {
            imgUrl: req.body.imgUrl
        }
        eventDao.updateEvent(eventId, req.body, function (err, result) {
            if (err) {
                return res.status(500).send(err);
            };
            res.status(200).send("Event is updated!")
        });
    });
};

function deleteEvent(req, res) {
    var userId = req.decoded._id.toString();
    var eventId = req.params._id
    eventDao.getEventById(eventId, function (err, result) {
        if (err) {
            return res.status(500).send('internal error!');
        }

        if (userId !== result.userHost.toString()) {
            return res.status(403).send('you are not host this event!');
        };

        eventDao.deleteEvent(eventId, req.body, function (err, result) {
            if (err) {
                return res.status(500).send(err);
            };
            res.status(200).send("Event is delete!")
        });
    });
};
