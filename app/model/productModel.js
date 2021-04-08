var sql = require('../../sql/sql');
const CONSTANTS = require('../constants/sql');
var ProductCategory = require('../model/productCategoryModel.js');

//Task object constructor
var Product = function (product) {
    this.product = product.product;
    this.id = product.id;
    this.description = product.description;
    this.created = product.created;
    this.category = new ProductCategory(product.category);
};

const now = new Date();

Product.sortableColumns = [
    'description',
    'category',
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
            item.category.id
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
    const query = `SELECT products.id, products.description, products.created, products.category_id as categoryId,
        products_categories.description as categoryDescription, products_categories.created as categoryCreated FROM products
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
    const query = `SELECT purchase_details.id, purchase_details.price, purchase_details.discount, purchase_details.unit,
        products.description as productDescription, products.id as productId, products.created as productCreated, 
        products_categories.id as productCategoryId, products_categories.description as productCategoryDescription, products_categories.created as productCategoryCreated,
        brands.id as brandId, brands.description as brandDescription, brands.created as brandCreated, 
        places.id as placeId, places.description as placeDescription, places.created as placeCreated,
        places_categories.id as placeCategoryId, places_categories.description as placeCategoryDescription, places_categories.created as placeCategoryCreated,
        purchases.date FROM purchase_details
        INNER JOIN products ON (products.id = purchase_details.product_id)
        INNER JOIN products_categories ON (products_categories.id = products.category_id)
        INNER JOIN purchases ON (purchases.id = purchase_details.purchase_id)
        INNER JOIN places ON (places.id = purchases.place_id)
        INNER JOIN places_categories ON (places_categories.id = places.category_id)
        LEFT JOIN brands ON (brands.id = purchase_details.brand_id)
        WHERE purchase_details.product_id = ?
        ORDER BY ?? ${sort === 'ASC' ? 'ASC' : 'DESC'}`;

    const mappedOrderBy = orderBy === 'place' ? 'placeDescription' : orderBy;
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
    const query = `SELECT products.id, products.description, products.created, products.category_id as categoryId,
            products_categories.description as categoryDescription, products_categories.created as categoryCreated FROM products
            INNER JOIN products_categories ON (products.category_id = products_categories.id)
            WHERE products.description LIKE ? OR products_categories.description LIKE ?
            ORDER BY ?? ${sort === 'ASC' ? 'ASC' : 'DESC'}
            LIMIT ?, ?`;

    const mappedOrderBy = orderBy === 'category' ? 'categoryDescription' : orderBy;
    sql.query(query, [`%${searchField}%`, `%${searchField}%`, mappedOrderBy, firstElement, CONSTANTS.PAGINATION_OFFSET], function (err, res) {
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
