var Product = require('../model/productModel.js');

exports.list_all = function (req, res) {
    let orderBy = req.query.orderBy;
    if (!Product.sortableColumns.includes(orderBy)) {
        orderBy = Product.sortableColumns[0];
    }

    let sort = req.query.sort || 'ASC';
    sort = sort.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    const page = req.query.page || 0;
    const searchField = req.query.searchField || '';

    console.log(`Fetching products with orderBy = ${orderBy}, sort: ${sort}, page: ${page}, searchField: ${searchField}`);
    Product.getAll(orderBy, sort, page, searchField, function (err, task) {
        if (err) {
            res.send(err);
        } else {
            Product.getTotalCount(searchField, function (err, countResult) {
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
    Product.getAllNames(function (err, task) {
        console.log('Fetching all product names...');
        if (err) {
            res.send(err);
        } else {
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.item.map((product) => new Product(product));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No product found.' });
    } else {
        Product.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(task);
            }
        });
    }
};

exports.delete = function (req, res) {
    console.log("Deleting a product...(" + req.params.itemId + ")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No product id found.' });
    } else {
        Product.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.json({ message: 'Product successfully deleted.' });
            }
        });
    }
};
