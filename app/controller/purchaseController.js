var Purchase = require('../model/purchaseModel.js');

exports.list_all = function (req, res) {
    Purchase.getAll(function (err, task) {
        if (err) {
            res.send(err);
        }
        res.send(task);
    });
};

exports.create = async function (req, res) {
    let newPurchase = new Purchase(req.body);

    if (newPurchase.purchase.length < 1) {
        res.status(400).send({ error: true, message: 'No purchase found.' });
    } else if (newPurchase.place_id === null || newPurchase.place_id === '') {
        res.status(400).send({ error: true, message: 'Please fill all mandatory fields (place)' });
    } else if (newPurchase.date === null || newPurchase.date === '') {
        res.status(400).send({ error: true, message: 'Please fill all mandatory fields (date)' });
    } else {

        try {
            Purchase.create(newPurchase, function (err, task) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(task);
                }
            });
        } catch (err) {
            res.send(err);
        }
    }
};

exports.get_by_id = async function (req, res) {
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No purchase id found.' });
    } else {
        let orderBy = req.query.orderBy;
        if (!Purchase.sortableColumns.includes(orderBy)) {
            orderBy = Purchase.sortableColumns[0];
        }

        let sort = req.query.sort || 'ASC';
        sort = sort.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

        console.log(`Fetching purchase with orderBy = ${orderBy}, sort: ${sort}`);

        Purchase.getPurchaseById(req.params.itemId, orderBy, sort, function (err, task) {
            if (err) {
                res.send(err);
            } else {
                res.json(task);
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

// exports.delete_a_task = function (req, res) {
//     Place.remove(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };
