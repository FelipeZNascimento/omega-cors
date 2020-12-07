var sql = require('../../sql/sql');

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

ShoppingList.add = function (newItemId, result) {
    const query = 'INSERT INTO shopping_list (product_id) VALUES (?)';
    sql.query(query, [newItemId], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at products (lines affected:' + res.affectedRows + ').');
            result(null, res);
        }
    });
};

ShoppingList.getAll = function (orderBy, sortAsc, result) {
    const query = `SELECT shopping_list.*,
        products_categories.description as category_description,
        products_categories.id as category_id,
        products.description as description
        FROM shopping_list
        INNER JOIN products ON (shopping_list.product_id = products.id)
        INNER JOIN products_categories ON (category_id = products_categories.id)
        ORDER BY ${orderBy} ${sortAsc}`;

    sql.query(query, function (err, res) {
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

ShoppingList.delete = function (newItemId, result) {
    sql.query("DELETE FROM shopping_list WHERE product_id = ?", [newItemId], function (err, res) {
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
