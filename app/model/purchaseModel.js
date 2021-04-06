var sql = require('../../sql/sql');

//Task object constructor
var Purchase = function (purchase) {
    this.id = purchase.id;
    this.purchase = purchase.purchase;
    this.placeId = purchase.placeId;
    this.date = purchase.date;
    this.total = purchase.total;
};

const now = new Date();

Purchase.sortableColumns = [
    'description',
    'category_description',
    'price'
];

createPurchaseDetails = function (newPurchase, insertId, result) {
    if (!insertId) {
        console.log("error: missing insertId");
        result("error: missing insertId", null);
    }

    const products = newPurchase.map((purchase) => [
        insertId,
        purchase.product_id,
        purchase.brand_id,
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

Purchase.create = function (newPurchase, result) {
    const query = 'INSERT INTO purchases (date, place_id, total) VALUES (?, ?, ?)';
    const params = [newPurchase.date, newPurchase.placeId, newPurchase.total];

    sql.query(query, params, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at purchases (lines affected:' + res.affectedRows + ').');
            return createPurchaseDetails(newPurchase.purchase, res.insertId, result);
        }
    });
};

Purchase.getById = function (purchaseId, orderBy, sort, result) {
    const ascQuery = `SELECT purchase_details.price, purchase_details.quantity, purchase_details.unit, purchase_details.discount, purchase_details.brand_id, purchase_details.details,
        products.id as product_id, products.description, products.category_id, products.id, brands.description as brand_description, products_categories.description as category_description FROM purchase_details
        INNER JOIN products ON products.id = purchase_details.product_id
        INNER JOIN products_categories ON products.category_id = products_categories.id
        LEFT JOIN brands ON brands.id = purchase_details.brand_id
        WHERE purchase_details.purchase_id = ?
        ORDER BY ?? ASC`;

    const descQuery = `SELECT purchase_details.price, purchase_details.quantity, purchase_details.unit, purchase_details.discount, purchase_details.brand_id, purchase_details.details,
        products.id as product_id, products.description, products.category_id, products.id, brands.description as brand_description, products_categories.description as category_description FROM purchase_details
        INNER JOIN products ON products.id = purchase_details.product_id
        INNER JOIN products_categories ON products.category_id = products_categories.id
        LEFT JOIN brands ON brands.id = purchase_details.brand_id
        WHERE purchase_details.purchase_id = ?
        ORDER BY ?? DESC`;

    const query = sort === 'ASC' ? ascQuery : descQuery;
    sql.query(query, [purchaseId, orderBy], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Purchase.getAll = function (result) {
    const query = `SELECT purchases.id, purchases.date, purchases.total,
        places.description, places_categories.description as categoryDescription,
        places_categories.id as categoryId,
        (SELECT COUNT(*) 
            FROM purchase_details 
            WHERE purchase_details.purchase_id = purchases.id) items
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
