var sql = require('../../sql/sql');
const CONSTANTS = require('../constants/sql');

//Task object constructor
var Product = function (product) {
    this.id = product.id;
    this.product = product.product;
    this.description = product.description;
    this.categoryId = product.category_id;
};

const now = new Date();

Product.sortableColumns = [
    'description',
    'category_description',
    'created',
    'id'
];

Product.create = function (newItems, result) {
    const items = newItems.map((item) => {
        return [
            item.id,
            item.description,
            item.categoryId
        ]
    });

    const query = 'INSERT INTO products (id, description, category_id) VALUES ? ON DUPLICATE KEY UPDATE description = VALUES(description)';
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

// Product.getProductById = function (productId, result) {
//     sql.query("SELECT product FROM products WHERE id = ? ", productId, function (err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//         }
//         else {
//             result(null, res);

//         }
//     });
// };
Product.getTotalCount = async function (searchField, result) {
    const query = `SELECT COUNT(*) AS totalCount FROM products
        INNER JOIN products_categories ON (products.category_id = products_categories.id)
        WHERE products.description LIKE ? OR products_categories.description LIKE ?`;

    sql.query(query, [`%${searchField}%`, `%${searchField}%`], function (err, countResult) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, countResult[0].totalCount);
        }
    });
}

Product.getAllNames = async function (result) {
    const query = `SELECT id, description FROM products
        ORDER BY description ASC`;

    sql.query(query, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

Product.getAll = async function (orderBy, sort, page, searchField, result) {
    const firstElement = page * CONSTANTS.PAGINATION_OFFSET;
    const ascQuery = `SELECT products.*, products_categories.description as category_description FROM products
            INNER JOIN products_categories ON (products.category_id = products_categories.id)
            WHERE products.description LIKE ? OR products_categories.description LIKE ?
            ORDER BY ?? ASC
            LIMIT ?, ?`;

    const descQuery = `SELECT products.*, products_categories.description as category_description FROM products
            INNER JOIN products_categories ON (products.category_id = products_categories.id)
            WHERE products.description LIKE ? OR products_categories.description LIKE ?
            ORDER BY ?? DESC
            LIMIT ?, ?`;

    const query = sort === 'ASC' ? ascQuery : descQuery;
    sql.query(query, [`%${searchField}%`, `%${searchField}%`, orderBy, firstElement, CONSTANTS.PAGINATION_OFFSET], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

Product.updateById = function (id, product, result) {
    sql.query("UPDATE products SET product = ? WHERE id = ?", [Product.product, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
Product.delete = function (id, result) {
    sql.query("DELETE FROM products WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

module.exports = Product;
