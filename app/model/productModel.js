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
    'id',
    'price',
    'place',
    'date'
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

Product.getById = function (productId, result) {
    const query = `SELECT products.id, products.description, products.created,
        products_categories.description as categoryDescription FROM products
        INNER JOIN products_categories ON (products.category_id = products_categories.id)
        WHERE products.id = ?`;

    sql.query(query, [productId], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

Product.getHistoryById = function (productId, orderBy, sort, result) {
    const ascQuery = `SELECT purchase_details.price, purchase_details.discount, purchase_details.unit,
        purchase_details.brand_id as brandId, purchases.place_id as placeId, products_categories.id as categoryId,
        products.description, products_categories.description as categoryDescription,
        places.description as placeDescription,
        purchases.date, brands.description as brandDescription FROM purchase_details
        INNER JOIN products ON (products.id = purchase_details.product_id)
        INNER JOIN products_categories ON (products_categories.id = products.category_id)
        INNER JOIN purchases ON (purchases.id = purchase_details.purchase_id)
        INNER JOIN places ON (places.id = purchases.place_id)
        LEFT JOIN brands ON (brands.id = purchase_details.brand_id)
        WHERE purchase_details.product_id = ?
        ORDER BY ?? ASC`;

    const descQuery = `SELECT purchase_details.price, purchase_details.discount, purchase_details.unit,
    purchase_details.brand_id as brandId, purchases.place_id as placeId, products_categories.id as categoryId,
        products.description, products_categories.description as categoryDescription,
        places.description as placeDescription,
        purchases.date, brands.description as brandDescription FROM purchase_details
        INNER JOIN products ON (products.id = purchase_details.product_id)
        INNER JOIN products_categories ON (products_categories.id = products.category_id)
        INNER JOIN purchases ON (purchases.id = purchase_details.purchase_id)
        INNER JOIN places ON (places.id = purchases.place_id)
        LEFT JOIN brands ON (brands.id = purchase_details.brand_id)
        WHERE purchase_details.product_id = ?
        ORDER BY ?? DESC`;

    const mappedOrderBy = orderBy === 'place' ? 'placeDescription' : orderBy;
    const query = sort === 'ASC' ? ascQuery : descQuery;
    sql.query(query, [productId, mappedOrderBy], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

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
