var PlaceCategory = require('../model/placeCategoryModel.js');

exports.list_all = function (req, res) {
    PlaceCategory.getAll(function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            console.log('res', task);
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.item.map((placeCategory) => new PlaceCategory(placeCategory));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No places found.' });
    } else {
        PlaceCategory.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(task);
            }
        });
    }
};

exports.delete = function (req, res) {
    console.log("Deleting a place category...(" + req.params.itemId +")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No category id found.' });
    } else {
        PlaceCategory.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.json({ message: 'Place category successfully deleted.' });
            }
        });
    }
};

// exports.create_a_task = function (req, res) {
//     var new_task = new PlaceCategory(req.body);

//     //handles null error 
//     if (!new_task.task || !new_task.status) {
//         res.status(400).send({ error: true, message: 'Please provide task/status' });
//     }
//     else {

//         PlaceCategory.createTask(new_task, function (err, task) {
//             if (err)
//                 res.send(err);
//             res.json(task);
//         });
//     }
// };

// exports.read_a_task = function (req, res) {
//     PlaceCategory.getTaskById(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.update_a_task = function (req, res) {
//     PlaceCategory.updateById(req.params.taskId, new Task(req.body), function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.delete_a_task = function (req, res) {
//     PlaceCategory.remove(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };
