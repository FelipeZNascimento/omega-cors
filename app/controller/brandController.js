var Brand = require('../model/brandModel.js');

exports.list_all = function (req, res) {
    Brand.getAll(function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.item.map((brand) => new Brand(brand));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No brands found.' });
    } else {
        Brand.createBrands(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(task);
            }
        });
    }
};

exports.delete = function (req, res) {
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No brand id found.' });
    } else {
        Brand.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.json({ message: 'Brand successfully deleted.' });
            }
        });
    }
};

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

