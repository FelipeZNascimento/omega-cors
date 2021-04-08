var Product = require('../model/productModel.js');

const fetchAll = ({
    orderBy = Product.sortableColumns[0],
    sort = 'ASC',
    page = 0,
    searchField = ''
}, res) => {
    console.log(`Fetching products with orderBy = ${orderBy}, sort: ${sort}, page: ${page}, searchField: ${searchField}`);
    Product.getAll(orderBy, sort, page, searchField, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            Product.getTotalCount(searchField, function (err, countResult) {
                const productObject = {
                    totalCount: err ? 0 : countResult,
                    data: data.map((item) => ({
                        id: item.id,
                        description: item.description,
                        created: item.created,
                        category: {
                            id: item.categoryId,
                            description: item.categoryDescription,
                            created: item.categoryCreated
                        }
                    }))
                };
                res.send(productObject);
            });
        }
    });
};

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

    return fetchAll({ orderBy, sort, page, searchField }, res);
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
    var requestParams = req.body.itemArray.map((product) => new Product(product));

    //handles null error 
    if (requestParams.length < 1) {
        res.status(400).send({ error: true, message: 'No product found.' });
    } else {
        Product.create(requestParams, function (err, task) {
            if (err) {
                res.status(400).send(err);
            } else {
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

                return fetchAll({ orderBy, sort, page, searchField }, res);
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

                return fetchAll({ orderBy, sort, page, searchField }, res);
            }
        });
    }
};

exports.get_history_by_id = function (req, res) {
    const productId = req.params.itemId;
    if (!productId) {
        res.status(400).send({ error: true, message: 'Missing query param: product id' });
    } else {
        let orderBy = req.query.orderBy;
        if (!Product.sortableColumns.includes(orderBy)) {
            orderBy = Product.sortableColumns[4];
        }

        let sort = req.query.sort || 'ASC';
        sort = sort.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

        console.log(`Fetching product with orderBy = ${orderBy}, sort: ${sort}`);
        Product.getHistoryById(productId, orderBy, sort, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                Product.getById(productId, function (err, productInfo) {
                    if (err) {
                        res.send(err);
                    } else {
                        const returnObject = {
                            product: {
                                id: productInfo[0].id,
                                description: productInfo[0].description,
                                created: productInfo[0].created,
                                category: {
                                    id: productInfo[0].categoryId,
                                    description: productInfo[0].categoryDescription,
                                    created: productInfo[0].categoryCreated
                                }
                            },
                            history: data.map((singleData) => ({
                                id: singleData.id,
                                price: singleData.price,
                                discount: singleData.discount,
                                unit: singleData.unit,
                                date: singleData.date,
                                brand: singleData.brandId ? {
                                    id: singleData.brandId,
                                    description: singleData.brandDescription,
                                    created: singleData.brandCreated,
                                } : null,
                                place: {
                                    id: singleData.placeId,
                                    description: singleData.placeDescription,
                                    created: singleData.placeCreated,
                                    category: {
                                        id: singleData.placeCategoryId,
                                        description: singleData.placeCategoryDescription,
                                        created: singleData.placeCategoryCreated
                                    }
                                }
                            }))
                        };

                        res.send(returnObject);
                    }
                });
            }
        });
    }
};