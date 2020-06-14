var sql = require('../../sql/sql');

//Task object constructor
var Brand = function (brand) {
    this.id = brand.id;
    this.brand = brand.brand;
    this.description = brand.description;
};

const now = new Date();

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

// Brand.getBrandById = function (brandId, result) {
//     sql.query("SELECT task FROM brands WHERE id = ? ", brandId, function (err, res) {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//         }
//         else {
//             result(null, res);

//         }
//     });
// };

Brand.getAll = function (result) {
    sql.query("SELECT * FROM brands", function (err, res) {

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
