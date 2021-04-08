var Brand = require('../model/brandModel.js');

const fetchAll = ({
    orderBy = Brand.sortableColumns[0],
    sort = 'ASC',
    page = 0,
    searchField = ''
}, res) => {
    console.log(`Fetching brands with orderBy = ${orderBy}, sort: ${sort}, page: ${page}, searchField: ${searchField}`);
    Brand.getAll(orderBy, sort, page, searchField, function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            Brand.getTotalCount(searchField, function (err, countResult) {
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
    if (!Brand.sortableColumns.includes(orderBy)) {
        orderBy = Brand.sortableColumns[0];
    }

    let sort = req.query.sort ? req.query.sort : 'ASC';
    sort = sort.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    const page = req.query.page || 0;
    const searchField = req.query.searchField || '';

    return fetchAll({ orderBy, sort, page, searchField }, res);
};

exports.list_all_names = function (req, res) {
    Brand.getAllNames(function (err, task) {
        console.log('Fetching all brand names...');
        if (err) {
            res.send(err);
        } else {
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.itemArray.map((brand) => new Brand(brand));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No brands found.' });
    } else {
        Brand.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                let orderBy = req.query.orderBy;
                if (!Brand.sortableColumns.includes(orderBy)) {
                    orderBy = Brand.sortableColumns[0];
                }

                let sort = req.query.sort ? req.query.sort : 'ASC';
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
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No brand id found.' });
    } else {
        Brand.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                let orderBy = req.query.orderBy;
                if (!Brand.sortableColumns.includes(orderBy)) {
                    orderBy = Brand.sortableColumns[0];
                }

                let sort = req.query.sort ? req.query.sort : 'ASC';
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
//     Place.updateById(req.params.taskId, new Task(req.body), function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };
