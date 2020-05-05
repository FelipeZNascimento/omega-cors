var ProductCategory = require('../model/productCategoryModel.js');

exports.list_all = function (req, res) {
    ProductCategory.getAll(function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            console.log('res', task);
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.item.map((placeCategory) => new ProductCategory(placeCategory));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No places found.' });
    } else {
        ProductCategory.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(task);
            }
        });
    }
};

exports.delete = function (req, res) {
    console.log("Deleting a product category...(" + req.params.itemId +")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No category id found.' });
    } else {
        ProductCategory.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.json({ message: 'Product category successfully deleted.' });
            }
        });
    }
};

// exports.create_a_task = function (req, res) {
//     var new_task = new ProductCategory(req.body);

//     //handles null error 
//     if (!new_task.task || !new_task.status) {
//         res.status(400).send({ error: true, message: 'Please provide task/status' });
//     }
//     else {

//         ProductCategory.createTask(new_task, function (err, task) {
//             if (err)
//                 res.send(err);
//             res.json(task);
//         });
//     }
// };

// exports.read_a_task = function (req, res) {
//     ProductCategory.getTaskById(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.update_a_task = function (req, res) {
//     ProductCategory.updateById(req.params.taskId, new Task(req.body), function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.delete_a_task = function (req, res) {
//     ProductCategory.remove(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };
