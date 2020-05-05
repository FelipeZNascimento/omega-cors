var Place = require('../model/placeModel.js');

exports.list_all = function (req, res) {
    Place.getAll(function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.item.map((place) => new Place(place));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No places found.' });
    } else {
        Place.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(task);
            }
        });
    }
};

exports.delete = function (req, res) {
    console.log("Deleting a place...(" + req.params.itemId +")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No place id found.' });
    } else {
        Place.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.json({ message: 'Place successfully deleted.' });
            }
        });
    }
};

// exports.create_a_task = function (req, res) {
//     var new_task = new Place(req.body);

//     //handles null error 
//     if (!new_task.task || !new_task.status) {
//         res.status(400).send({ error: true, message: 'Please provide task/status' });
//     }
//     else {

//         Place.createTask(new_task, function (err, task) {
//             if (err)
//                 res.send(err);
//             res.json(task);
//         });
//     }
// };

// exports.read_a_task = function (req, res) {
//     Place.getTaskById(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.update_a_task = function (req, res) {
//     Place.updateById(req.params.taskId, new Task(req.body), function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.delete_a_task = function (req, res) {
//     Place.remove(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };
