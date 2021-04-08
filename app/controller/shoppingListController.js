var ShoppingList = require('../model/shoppingListModel.js');
var Product = require('../model/productModel.js');

const fetchAll = ({
    orderBy = ShoppingList.sortableColumns[0],
    sort = 'ASC',
    page = 0,
    searchField = ''
}, res) => {
    console.log(`Fetching shopping list with orderBy = ${orderBy}, sort: ${sort}, page: ${page}, searchField: ${searchField}`);
    ShoppingList.getAll(orderBy, sort, page, searchField, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            const returnObject = {
                data: data.map((item) => ({
                    id: item.id,
                    product: {
                        id: item.productId,
                        description: item.productDescription,
                        created: item.productCreated,
                        category: {
                            id: item.categoryId,
                            description: item.categoryDescription,
                            created: item.categoryCreated
                        }
                    }
                }))
            };

            res.send(returnObject);
        }
    });
};


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

    return fetchAll({ orderBy, sort, page, searchField }, res);
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

            return fetchAll({}, res);
        });
    }
};

exports.delete = function (req, res) {
    const { itemId } = req.params;
    console.log("Deleting a product from shopping list...(" + itemId + ")");
    ShoppingList.delete(itemId, function (err, task) {
        if (err) {
            res.status(409).send(err);
        }

        return fetchAll({}, res);
    });
};
