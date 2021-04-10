var sql = require('../../sql/sql');
const CONSTANTS = require('../constants/sql');

//Task object constructor
var ShoppingList = function (product) {
    this.id = product.id;
    this.categoryId = product.category_id;
    this.productId = product.product_id;
};

const now = new Date();

ShoppingList.sortableColumns = [
    'description',
    'category',
    'created',
    'id'
];

const mapSortables = (orderBy) => {
    switch(orderBy) {
        case 'category':
            return 'categoryDescription';
        case 'id':
            return 'id';
        default:
            return `products.${orderBy}`;
    }
};

ShoppingList.create = function (newItems, result) {
    const items = newItems.map((item) => item.id);

    const query = 'INSERT INTO shopping_list (product_id) VALUES (?)';
    sql.query(query, [items], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at products (lines affected:' + res.affectedRows + ').');
            result(null, res);
        }
    });
};

ShoppingList.getTotalCount = async function (searchField, result) {
    const query = `SELECT COUNT(*) AS totalCount FROM shopping_list
        INNER JOIN products ON (shopping_list.product_id = products.id)
        WHERE products.description LIKE ?`;

    sql.query(query, [`%${searchField}%`], function (err, countResult) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, countResult[0].totalCount);
        }
    });
};

ShoppingList.getAll = function (orderBy, sort, page, searchField, result) {
    const firstElement = page * CONSTANTS.PAGINATION_OFFSET;

    const query = `SELECT shopping_list.id, shopping_list.created,
        products_categories.description as categoryDescription, products_categories.id as categoryId,
        products_categories.created as categoryCreated,
        products.id as productId, products.description as productDescription, products.created as productCreated
        FROM shopping_list
        INNER JOIN products ON (shopping_list.product_id = products.id)
        INNER JOIN products_categories ON (category_id = products_categories.id)
        WHERE products.description LIKE ? OR products_categories.description LIKE ?
        ORDER BY ?? ${sort === 'ASC' ? 'ASC' : 'DESC'}`;

    let mappedOrderBy = mapSortables(orderBy);
    sql.query(query, [`%${searchField}%`, `%${searchField}%`, mappedOrderBy, firstElement, CONSTANTS.PAGINATION_OFFSET], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    }
    );
};

ShoppingList.delete = function (toBeDeletedId, result) {
    if (toBeDeletedId === 'all') {
        sql.query("TRUNCATE shopping_list", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    } else {
        sql.query("DELETE FROM shopping_list WHERE id = ?", [toBeDeletedId], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }
};

module.exports = ShoppingList;
