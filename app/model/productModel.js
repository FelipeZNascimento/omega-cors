var sql = require('./db.js');

//Task object constructor
var Product = function (product) {
    this.product = product.product;
    this.description = product.description;
    this.categoryId = product.categoryId;
};

const now = new Date();

Product.create = function (newProducts, result) {
    const products = newProducts.map((product) => {
        return [
            product.description,
            product.categoryId
        ]    
    });

    console.log(products);

    const query = 'INSERT INTO products (description, category_id) VALUES ?';
    sql.query(query, [products], function (err, res) {
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
                console.log('products : ', res);
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
