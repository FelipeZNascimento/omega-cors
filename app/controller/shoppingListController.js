var ShoppingList = require('../model/shoppingListModel.js');

exports.list_all = function (req, res) {
    let orderBy = req.query.orderBy;
    if (!ShoppingList.sortableColumns.includes(orderBy)) {
        orderBy = ShoppingList.sortableColumns[0];
    }

    let sortAsc = req.query.sort ? req.query.sort : 'ASC';
    sortAsc = sortAsc.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    ShoppingList.getAll(orderBy, sortAsc, function (err, task) {
        console.log('controller');
        if (err) {
            res.send(err);
        }
        res.send(task);
    });
};

exports.add = function (req, res) {
    console.log("Adding a product to shopping list...(" + req.params.itemId + ")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No product id found.' });
    } else {
        ShoppingList.add(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            }
            res.send(task);
        });
    }
};

exports.delete = function (req, res) {
    console.log("Deleting a product...(" + req.params.itemId + ")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No product id found.' });
    } else {
        ShoppingList.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            }
            res.send(task);
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
