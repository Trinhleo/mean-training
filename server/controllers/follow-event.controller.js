            var favEventDao = require('./../dao/favorite-event.dao');
module.exports = {
    getAllFavEvents: getAllFavEvents,
    // getAllFavEventsByUserId: getAllEventsByUserId,
    getFavEventByEventId: getFavEventByEventId,
    // getAllFavEventsOfUser: getAllEventsOfUser,
    createFavEvent: createFavEvent,
    // updateFavEvent: updateEvent,
    deleteFavEvent: deleteFavEvent
};

function getAllFavEvents(req, res) {
    var id = req.decoded._id;
    favEventDao.listMyFavEvents(function (err, result) {
        if (err) {
            res.status(500).send('internal error!');
        } else {
            res.status(200).send(result);
        }
    });
};

function getFavEventByEventId(req, res) {
    var eventId = req.params.id;
    favEventDao.getFavEventByEventId(req.decoded._id, eventId, function (err, result) {
        if (err) {
            res.status(400).send('not found!');
        } else {
            res.status(200).send(result);
        }
    });
};

// function getEventById(req, res) {
//     var id = req.params.id;
//     eventDao.getEventById(id, function (err, result) {
//         if (err) {
//             res.status(500).send('internal error!');
//         } else {
//             res.status(200).send(result);
//             console.log(result);
//         }
//     });
// };

// function getAllEventsOfUser(req, res) {
//     var id = req.decoded._id;
//     favEventDao.listAllEventsByUserId(id, function (err, result) {
//         if (err) {
//             res.status(500).send('internal error!');
//         } else {
//             res.status(200).send(result);
//         }
//     });
// };

function createFavEvent(req, res) {
    var event = req.body.event
    if (!event) {
        return res.status(403).send({
            message: "error input information!"
        });
    };
    var eventInfo = {
        userAdd: req.decoded._id,
        event: event
    }
    favEventDao.createFavEvent(eventInfo, function (err, result) {
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

// function updateEvent(req, res) {
//     var userId = req.decoded._id.toString();
//     var eventId = req.params._id || req.body._id;
//     eventDao.getEventById(eventId, function (err, result) {
//         if (err) {
//             return res.status(500).send('internal error!');
//         };
//         if (null === result) {
//             return res.status(403).send('you are not host this event!');
//         };
//         console.log(result);
//         if (userId !== result.userHost._id.toString()) {
//             return res.status(403).send('you are not host this event!');
//         };
//         var eventInfo = {
//             imgUrl: req.body.imgUrl
//         }
//         eventDao.updateEvent(eventId, eventInfo, function (err, result) {
//             if (err) {
//                 return res.status(500).send(err);
//             };
//             res.status(200).send("Event is updated!")
//         });
//     });
// };

function deleteFavEvent(req, res) {
    var userId = req.decoded._id;
    var event = req.params.id;
    if (!event) {
        return res.status(403).send({
            message: "error input information!"
        });
    };
    var favEventInfo = {
        userAdd: userId,
        event: event
    }
    favEventDao.deleteFavEvent(favEventInfo,function (err, result) {
        if (err) {
            return res.status(500).send(err);
        };
        res.status(200).send("Event is delete!")
    });
};
