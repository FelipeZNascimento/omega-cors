var sql = require('../../sql/sql');

//Task object constructor
var Purchase = function (purchase) {
    this.id = purchase.id;
    this.purchase = purchase.purchase;
    this.placeId = purchase.placeId;
    this.date = purchase.date;
};

const now = new Date();

createPurchaseDetails = function (newPurchase, insertId, result) {
    if (!insertId) {
        console.log("error: missing insertId");
        result("error: missing insertId", null);
    }

    const products = newPurchase.map((purchase) => [
        insertId,
        purchase.product.id,
        purchase.brand !== null
            ? purchase.brand.id
            : 'null',
        parseFloat(purchase.price),
        purchase.discount
    ]);

    const query = 'INSERT INTO purchase_details (purchase_id, product_id, brand_id, price, discount) VALUES ?';
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
    console.log(newPurchase);
    const query = 'INSERT INTO purchases (date, place_id) VALUES (?, ?)';
    const params = [newPurchase.date, newPurchase.placeId];

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

Purchase.getPurchaseById = function (purchaseId, result) {
    sql.query("SELECT task FROM purchases WHERE id = ? ", purchaseId, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
Purchase.getAll = function (result) {
    sql.query("SELECT * FROM purchases", function (err, res) {

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
