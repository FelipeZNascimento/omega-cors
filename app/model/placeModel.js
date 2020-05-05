var sql = require('./db.js');

//Task object constructor
var Place = function (place) {
    this.place = place.place;
    this.description = place.description;
    this.categoryId = place.categoryId;
};

const now = new Date();

Place.create = function (newPlaces, result) {
    const places = newPlaces.map((place) => {
        return [
            place.description,
            place.categoryId
        ]    
    });

    console.log(places);

    const query = 'INSERT INTO places (description, category_id) VALUES ?';
    sql.query(query, [places], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('(' + now + ') Entry ' + res.insertId + ' succesfully saved at places (lines affected:' + res.affectedRows + ').');
            result(null, res);
        }        
    });
};
Place.getPlaceById = function (placeId, result) {
    sql.query("SELECT task FROM places WHERE id = ? ", placeId, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);

        }
    });
};
Place.getAll = function (result) {
    sql.query("SELECT places.*, places_categories.description as category_description FROM places INNER JOIN places_categories ON (places.category_id = places_categories.id)", 
        function (err, res) {

            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('tasks : ', res);
                result(null, res);
            }
        });
};
Place.updateById = function (id, place, result) {
    sql.query("UPDATE places SET place = ? WHERE id = ?", [place.place, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
Place.delete = function (id, result) {
    sql.query("DELETE FROM places WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

module.exports = Place;
