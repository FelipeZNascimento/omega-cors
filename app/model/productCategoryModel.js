var sql = require('../../sql/sql');
const CONSTANTS = require('../constants/sql');

//Task object constructor
var ProductCategory = function (category) {
    this.id = category.id;
    this.category = category.category;
    this.description = category.description;
    this.category_id = category.category_id;
};

const now = new Date();

ProductCategory.sortableColumns = [
    'description',
    'created',
    'id'
];

ProductCategory.create = function (newItems, result) {
    const items = newItems.map((item) => {
        return [
            item.id,
            item.description
        ]
    });

    const query = 'INSERT INTO products_categories (id, description) VALUES ? ON DUPLICATE KEY UPDATE description = VALUES(description)';
    sql.query(query, [items], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at places (lines affected:' + res.affectedRows + ').');
            result(null, res);
        }
    });
};

ProductCategory.getTotalCount = async function (searchField, result) {
    const query = `SELECT COUNT(*) AS totalCount FROM products_categories
        WHERE description LIKE ?`;

    sql.query(query, [`%${searchField}%`], function (err, countResult) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, countResult[0].totalCount);
        }
    });
}

ProductCategory.getAllNames = async function (result) {
    const query = `SELECT id, description FROM products_categories
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

ProductCategory.getAll = function (orderBy, sort, page, searchField, result) {
    const firstElement = page === 'null' ? 0 : page * CONSTANTS.PAGINATION_OFFSET;
    const paginationOffset = page === 'null' ? 9999999999999 : CONSTANTS.PAGINATION_OFFSET;
    const description = searchField || '';

    const ascQuery = `SELECT * FROM products_categories
            WHERE description LIKE ?
            ORDER BY ?? ASC
            LIMIT ?, ?`;

    const descQuery = `SELECT * FROM products_categories
            WHERE description LIKE ?
            ORDER BY ?? DESC
            LIMIT ?, ?`;

    const query = sort === 'ASC' ? ascQuery : descQuery;

    sql.query(query, [`%${description}%`, orderBy, firstElement, paginationOffset], function (err, res) {
        if (err) {
            console.log(err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

// ProductCategory.updateById = function (id, place, result) {
//     sql.query("UPDATE places SET place = ? WHERE id = ?", [place.place, id], function (err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//         }
//         else {
//             result(null, res);
//         }
//     });
// };

ProductCategory.delete = function (id, result) {
    sql.query("DELETE FROM products_categories WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

module.exports = ProductCategory;
