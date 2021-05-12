var sql = require('../../sql/sql');
const CONSTANTS = require('../constants/sql');
var PlaceCategory = require('../model/placeCategoryModel.js');

//Task object constructor
var Place = function (place) {
    this.place = place.place;
    this.id = place.id;
    this.description = place.description;
    this.created = place.created;
    this.category = new PlaceCategory(place.category);
};

const now = new Date();

Place.sortableColumns = [
    'description',
    'category',
    'created',
    'id'
];

Place.create = function (newItems, result) {
    const items = newItems.map((item) => {
        return [
            item.id,
            item.description,
            item.category.id
        ]
    });

    const query = 'INSERT INTO places (id, description, category_id) VALUES ? ON DUPLICATE KEY UPDATE description = VALUES(description)';
    sql.query(query, [items], function (err, res) {
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

Place.getTotalCount = async function (searchField, result) {
    const query = `SELECT COUNT(*) AS totalCount FROM places
        INNER JOIN places_categories ON (places.category_id = places_categories.id)
        WHERE places.description LIKE ? OR places_categories.description LIKE ?`;

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

Place.getAllNames = async function (result) {
    const query = `SELECT id, description FROM places
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

Place.getAll = async function (orderBy, sort, page, searchField, result) {
    const firstElement = page === 'null' ? 0 : page * CONSTANTS.PAGINATION_OFFSET;
    const paginationOffset = page === 'null' ? 9999999999999 : CONSTANTS.PAGINATION_OFFSET;
    const description = searchField || '';

    const query = `SELECT places.id, places.description, places.created, places.category_id as categoryId,
        places_categories.description as categoryDescription, places_categories.created as categoryCreated FROM places
        INNER JOIN places_categories ON (places.category_id = places_categories.id)
        WHERE places.description LIKE ? OR places_categories.description LIKE ?
        ORDER BY ?? ${sort === 'ASC' ? 'ASC' : 'DESC'}
        LIMIT ?, ?`;

    const mappedOrderBy = orderBy === 'category' ? 'categoryDescription' : orderBy;
    sql.query(query, [`%${description}%`, `%${searchField}%`, mappedOrderBy, firstElement, paginationOffset], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
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
