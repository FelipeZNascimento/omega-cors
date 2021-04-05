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
    'category_description',
    'created',
    'id'
];

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

    const ascQuery = `SELECT shopping_list.*,
        products_categories.description as category_description,
        products_categories.id as category_id,
        products.description as description
        FROM shopping_list
        INNER JOIN products ON (shopping_list.product_id = products.id)
        INNER JOIN products_categories ON (category_id = products_categories.id)
        WHERE products.description LIKE ? OR products_categories.description LIKE ?
        ORDER BY ?? ASC`;

    const descQuery = `SELECT shopping_list.*,
        products_categories.description as category_description,
        products_categories.id as category_id,
        products.description as description
        FROM shopping_list
        INNER JOIN products ON (shopping_list.product_id = products.id)
        INNER JOIN products_categories ON (category_id = products_categories.id)
        WHERE products.description LIKE ? OR products_categories.description LIKE ?
        ORDER BY ?? DESC`;

    const query = sort === 'ASC' ? ascQuery : descQuery;

    sql.query(query, [`%${searchField}%`, `%${searchField}%`, orderBy, firstElement, CONSTANTS.PAGINATION_OFFSET], function (err, res) {
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
    sql.query("DELETE FROM shopping_list WHERE id = ?", [toBeDeletedId], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

module.exports = ShoppingList;
