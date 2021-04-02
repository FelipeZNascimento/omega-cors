var ShoppingList = require('../model/shoppingListModel.js');
var Product = require('../model/productModel.js');

exports.list_all = function (req, res) {
    let orderBy = req.query.orderBy;
    if (!ShoppingList.sortableColumns.includes(orderBy)) {
        orderBy = ShoppingList.sortableColumns[0];
    }

    let sort = req.query.sort || 'ASC';
    sort = sort.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    const page = req.query.page || 0;
    const searchField = req.query.searchField || '';

    ShoppingList.getAll(orderBy, sort, page, searchField, function (err, task) {
        console.log('controller');
        if (err) {
            res.send(err);
        } else {
            ShoppingList.getTotalCount(searchField, function (err, countResult) {
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

exports.create = function (req, res) {
    var requestParams = req.body.itemArray.map((product) => new Product(product));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No product found.' });
    } else {
        ShoppingList.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            }
            res.json(task);
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
