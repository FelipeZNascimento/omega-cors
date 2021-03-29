var sql = require('../../sql/sql');
const CONSTANTS = require('../constants/sql');

//Task object constructor
var Brand = function (brand) {
    this.id = brand.id;
    this.brand = brand.brand;
    this.description = brand.description;
};

const now = new Date();

Brand.sortableColumns = [
    'description',
    'created',
    'id'
];

Brand.create = function (newItems, result) {
    const items = newItems.map((item) => {
        return [
            item.id,
            item.description
        ]
    });

    const descriptionsArray = newItems.map((item) => {
        return item.description
    });

    const query = 'INSERT INTO brands (id, description) VALUES ? ON DUPLICATE KEY UPDATE description = VALUES(description)';
    sql.query(query, [items, descriptionsArray], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at brands (lines affected:' + res.affectedRows + ').');
            result(null, res);
        }
    });
};

Brand.getTotalCount = async function (searchField, result) {
    const query = `SELECT COUNT(*) AS totalCount FROM brands
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

Brand.getAllNames = async function (result) {
    const query = `SELECT id, description FROM brands
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

Brand.getAll = function (orderBy, sort, page, searchField, result) {
    const firstElement = page * CONSTANTS.PAGINATION_OFFSET;
    const ascQuery = `SELECT * FROM brands
        WHERE description LIKE ?
        ORDER BY ?? ASC
        LIMIT ?, ?`;

    const descQuery = `SELECT * FROM brands
        WHERE description LIKE ?
        ORDER BY ?? DESC
        LIMIT ?, ?`;

    const query = sort === 'ASC' ? ascQuery : descQuery;
    sql.query(query, [`%${searchField}%`, orderBy, firstElement, CONSTANTS.PAGINATION_OFFSET], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

// Brand.updateById = function (id, brand, result) {
//     sql.query("UPDATE brands SET brand = ? WHERE id = ?", [Brand.brand, id], function (err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//         }
//         else {
//             result(null, res);
//         }
//     });
// };

Brand.delete = function (id, result) {
    sql.query("DELETE FROM brands WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

module.exports = Brand;
