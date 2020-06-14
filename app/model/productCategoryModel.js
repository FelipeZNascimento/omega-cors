var sql = require('../../sql/sql');

//Task object constructor
var ProductCategory = function (category) {
    this.id = category.id;
    this.category = category.category;
    this.description = category.description;
    this.category_id = category.category_id;
};

const now = new Date();

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
ProductCategory.getAll = function (result) {
    sql.query("SELECT * FROM products_categories", function (err, res) {

        if (err) {
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
