var ProductCategory = require('../model/productCategoryModel.js');

const fetchAll = ({
    orderBy = ProductCategory.sortableColumns[0],
    sort = 'ASC',
    page = 0,
    searchField = ''
}, res) => {
    console.log(`Fetching product categories with orderBy = ${orderBy}, sort: ${sort}, page: ${page}, searchField: ${searchField}`);
    ProductCategory.getAll(orderBy, sort, page, searchField, function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            ProductCategory.getTotalCount(searchField, function (err, countResult) {
                const returnObject = {
                    totalCount: err ? 0 : countResult,
                    count: task.length,
                    data: task
                }

                res.send(returnObject);
            })
        }
    });
};

exports.list_all = function (req, res) {
    let orderBy = req.query.orderBy;
    if (!ProductCategory.sortableColumns.includes(orderBy)) {
        orderBy = ProductCategory.sortableColumns[0];
    }

    let sort = req.query.sort || 'ASC';
    sort = sort.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    const page = req.query.page || 0;
    const searchField = req.query.searchField || '';

    return fetchAll({ orderBy, sort, page, searchField }, res);
};

exports.list_all_names = function (req, res) {
    ProductCategory.getAllNames(function (err, task) {
        console.log('Fetching all product category names...');
        if (err) {
            res.send(err);
        } else {
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.itemArray.map((placeCategory) => new ProductCategory(placeCategory));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No places found.' });
    } else {
        ProductCategory.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                let orderBy = req.query.orderBy;
                if (!ProductCategory.sortableColumns.includes(orderBy)) {
                    orderBy = ProductCategory.sortableColumns[0];
                }

                let sort = req.query.sort || 'ASC';
                sort = sort.toUpperCase() === 'DESC'
                    ? 'DESC'
                    : 'ASC';

                const page = req.query.page || 0;
                const searchField = req.query.searchField || '';

                return fetchAll({ orderBy, sort, page, searchField }, res);
            }
        });
    }
};

exports.delete = function (req, res) {
    console.log("Deleting a product category...(" + req.params.itemId + ")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No category id found.' });
    } else {
        ProductCategory.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                let orderBy = req.query.orderBy;
                if (!ProductCategory.sortableColumns.includes(orderBy)) {
                    orderBy = ProductCategory.sortableColumns[0];
                }

                let sort = req.query.sort || 'ASC';
                sort = sort.toUpperCase() === 'DESC'
                    ? 'DESC'
                    : 'ASC';

                const page = req.query.page || 0;
                const searchField = req.query.searchField || '';

                return fetchAll({ orderBy, sort, page, searchField }, res);
            }
        });
    }
};

// exports.update_a_task = function (req, res) {
//     ProductCategory.updateById(req.params.taskId, new Task(req.body), function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };
