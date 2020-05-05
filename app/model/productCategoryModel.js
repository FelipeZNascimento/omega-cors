var sql = require('./db.js');

//Task object constructor
var ProductCategory = function (category) {
    this.category = category.category;
    this.description = category.description;
    this.category_id = category.category_id;
};

const now = new Date();

ProductCategory.create = function (newProductsCategories, result) {
    const productsCategories = newProductsCategories.map((productCategory) => {
        return [
            productCategory.description,
            productCategory.icon
        ]    
    });

    const query = 'INSERT INTO products_categories (description, icon) VALUES ?';
    sql.query(query, [productsCategories], function (err, res) {
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
            console.log('tasks : ', res);
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
