var sql = require('../../sql/sql');
var Place = require('../model/placeModel.js');
var Brand = require('../model/brandModel.js');
var Product = require('../model/productModel.js');

//Task object constructor
var Purchase = function (purchase) {
    this.purchase = purchase.purchase;

    this.id = purchase.id;
    this.date = purchase.date;
    this.details = purchase.details;
    this.discount = purchase.discount;
    this.price = purchase.price;
    this.quantity = purchase.quantity;
    this.unit = purchase.unit;

    this.brand = new Brand(purchase.brand);
    this.product = new Product(purchase.product);
};

const now = new Date();

Purchase.sortableColumns = [
    'description',
    'category',
    'price'
];

const mapSortables = (orderBy) => {
    switch(orderBy) {
        case 'category':
            return 'categoryDescription';
        case 'price':
            return 'purchase_details.price';
        default:
            return `products.${orderBy}`;
    }
};


createPurchaseDetails = function (newPurchase, insertId, result) {
    if (!insertId) {
        console.log("error: missing insertId");
        result("error: missing insertId", null);
    }

    const products = newPurchase.map((purchase) => [
        insertId,
        purchase.product.id,
        purchase.brand.id,
        parseFloat(purchase.price),
        parseFloat(purchase.quantity),
        purchase.unit,
        purchase.discount || false,
        purchase.details || ''
    ]);

    const query = 'INSERT INTO purchase_details (purchase_id, product_id, brand_id, price, quantity, unit, discount, details) VALUES ?';
    sql.query(query, [products], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at purchase_details (lines affected:' + res.affectedRows + ').');
            result(null, res);
        }
    });
}

Purchase.create = function (date, place, total, purchaseItems, result) {
    const query = 'INSERT INTO purchases (date, place_id, total) VALUES (?, ?, ?)';
    const params = [date, place.id, total];

    sql.query(query, params, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at purchases (lines affected:' + res.affectedRows + ').');
            return createPurchaseDetails(purchaseItems, res.insertId, result);
        }
    });
};

Purchase.getDetailsById = function (purchaseId, orderBy, sort, result) {
    const query = `SELECT purchase_details.price, purchase_details.quantity, purchase_details.unit, purchase_details.details,
        purchase_details.discount, purchase_details.brand_id as brandId, 
        products.id as productId, products.description as productDescription, products.created as productCreated,
        brands.description as brandDescription, brands.created as brandCreated,
        products_categories.description as categoryDescription, products_categories.created as categoryCreated,
        products.category_id as categoryId FROM purchase_details
        INNER JOIN products ON products.id = purchase_details.product_id
        INNER JOIN products_categories ON products.category_id = products_categories.id
        LEFT JOIN brands ON brands.id = purchase_details.brand_id
        WHERE purchase_details.purchase_id = ?
        ORDER BY ?? ${sort === 'ASC' ? 'ASC' : 'DESC'}`;

    const mappedOrderBy = mapSortables(orderBy);
    sql.query(query, [purchaseId, mappedOrderBy], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Purchase.getAll = function (result) {
    const query = `SELECT purchases.id, purchases.date, purchases.total, purchases.created,
        purchases.place_id as placeId, places.description as placeDescription, places.created as placeCreated,
        places_categories.description as categoryDescription, places_categories.id as categoryId, places_categories.created as categoryCreated,
        (SELECT COUNT(*) 
            FROM purchase_details 
            WHERE purchase_details.purchase_id = purchases.id) as numberOfItems
        FROM purchases
        INNER JOIN places ON places.id = purchases.place_id
        INNER JOIN places_categories ON places_categories.id = places.category_id
        ORDER BY purchases.date DESC`;

    sql.query(query, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Purchase.updateById = function (id, purchase, result) {
    sql.query("UPDATE purchases SET purchase = ? WHERE id = ?", [Purchase.purchase, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Purchase.remove = function (id, result) {
    sql.query("DELETE FROM purchases WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = Purchase;
