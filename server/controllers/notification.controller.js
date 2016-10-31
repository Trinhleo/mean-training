var notifyDao = require('./../dao/notification.dao');

module.exports = {
    getMyNotification: listMyNotification,
    createNotification: createNotification,
    updateNotification: updateNotification,
    deleteNotification: deleteNotification
}
function getMyNotification(req, res) {
    var id = req.decoded._id;
    notifyDao.listMyNotification(function (err, result) {
        if (err) {
            res.status(400).send('not found');
        } else {
            res.status(200).send(result);
        }
    });
};

// function getFavEventByEventId(req, res) {
//     var eventId = req.params.id;
//     favEventDao.getFavEventByEventId(req.decoded._id, eventId, function (err, result) {
//         if (err) {
//             res.status(400).send('not found!');
//         } else {
//             res.status(200).send(result);
//         }
//     });
// };

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

function createNotification(req, res) {
    var userId = req.body.userId
    if (!userId) {
        return res.status(403).send({
            message: "error input information!"
        });
    };
    var eventInfo = {
        userAdd: req.decoded._id,
        event: event
    }
    notifyDao.createFavEvent(eventInfo, function (err, result) {
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

function updateNotification(req, res) {
    var userId = req.decoded._id.toString();
    var notifyId = req.params._id || req.body._id;
    var notifyInfo = {
        isRead: true
    }
    notifyDao.updateNotification(notifyId, notifyInfo, function (err, result) {
        if (err) {
            return res.status(400).send(err);
        };
        res.status(200).send("notification is read!")
    });
};

function deleteNotification(req, res) {
    var userId = req.decoded._id;
    var notify = req.params.id;
    if (!notify) {
        return res.status(403).send({
            message: "error input information!"
        });
    };

    notifyDao.deleteNotification(notify, function (err, result) {
        if (err) {
            return res.status(500).send(err);
        };
        res.status(200).send("Event is delete!")
    });
};
