var sql = require('../../sql/sql');

//Task object constructor
var Product = function (product) {
    this.id = product.id;
    this.product = product.product;
    this.description = product.description;
    this.categoryId = product.category_id;
};

const now = new Date();

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

Product.getAll = function (result) {
    sql.query("SELECT products.*, products_categories.description as category_description FROM products INNER JOIN products_categories ON (products.category_id = products_categories.id)",         function (err, res) {

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
