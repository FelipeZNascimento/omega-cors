var PlaceCategory = require('../model/placeCategoryModel.js');

const fetchAll = ({
    orderBy = PlaceCategory.sortableColumns[0],
    sort = 'ASC',
    page = 0,
    searchField = ''
}, res) => {
    console.log(`Fetching place categories with orderBy = ${orderBy}, sort: ${sort}, page: ${page}, searchField: ${searchField}`);
    PlaceCategory.getAll(orderBy, sort, page, searchField, function (err, task) {
        if (err) {
            res.status(400).send(err);
        } else {
            PlaceCategory.getTotalCount(searchField, function (err, countResult) {
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

exports.list_all = function (req, res) {
    let orderBy = req.query.orderBy;
    if (!PlaceCategory.sortableColumns.includes(orderBy)) {
        orderBy = PlaceCategory.sortableColumns[0];
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
    PlaceCategory.getAllNames(function (err, task) {
        console.log('Fetching all place category names...');
        if (err) {
            res.send(err);
        } else {
            res.send(task);
        }
    });
};

exports.create = function (req, res) {
    var requestParams = req.body.itemArray.map((placeCategory) => new PlaceCategory(placeCategory));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No places found.' });
    } else {
        PlaceCategory.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
                let orderBy = req.query.orderBy;
                if (!PlaceCategory.sortableColumns.includes(orderBy)) {
                    orderBy = PlaceCategory.sortableColumns[0];
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
    console.log("Deleting a place category...(" + req.params.itemId + ")");
    if (!req.params.itemId) {
        res.status(400).send({ error: true, message: 'No category id found.' });
    } else {
        PlaceCategory.delete(req.params.itemId, function (err, task) {
            if (err) {
                res.status(409).send(err);
            } else {
                let orderBy = req.query.orderBy;
                if (!PlaceCategory.sortableColumns.includes(orderBy)) {
                    orderBy = PlaceCategory.sortableColumns[0];
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
