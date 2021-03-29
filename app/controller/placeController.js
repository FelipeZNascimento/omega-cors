var Place = require('../model/placeModel.js');

exports.list_all = function (req, res) {
    let orderBy = req.query.orderBy;
    if (!Place.sortableColumns.includes(orderBy)) {
        orderBy = Place.sortableColumns[0];
    }

    let sort = req.query.sort || 'ASC';
    sort = sort.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    const page = req.query.page || 0;
    const searchField = req.query.searchField || '';

    console.log(`Fetching places with orderBy = ${orderBy}, sort: ${sort}, page: ${page}, searchField: ${searchField}`);
    Place.getAll(orderBy, sort, page, searchField, function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            Place.getTotalCount(searchField, function (err, countResult) {
                const returnObject = {
                    totalCount: err ? 0 : countResult,
                    count: task.length,
                    data: task
                }

                res.send(returnObject);
            });
        }
    });
};

exports.list_all_names = function (req, res) {
    Place.getAllNames(function (err, task) {
        console.log('Fetching all place names...');
        if (err) {
            res.send(err);
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
    console.log("Deleting a place...(" + req.params.itemId + ")");
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
