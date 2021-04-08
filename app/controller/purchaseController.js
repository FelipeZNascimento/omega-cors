var Purchase = require('../model/purchaseModel.js');
var Place = require('../model/placeModel.js');

exports.list_all = function (req, res) {
    Purchase.getAll(function (err, data) {
        if (err) {
            res.send(err);
        }

        const returnObject = {
            data: data.map((item) => ({
                numberOfItems: item.numberOfItems,
                id: item.id,
                date: item.date,
                total: item.total,
                created: item.created,
                place: {
                    id: item.placeId,
                    description: item.placeDescription,
                    created: item.placeCreated,
                    category: {
                        id: item.categoryId,
                        description: item.categoryDescription,
                        created: item.categoryCreated
                    }
                }
            }))
        }

        res.send(returnObject);
    });
};

exports.create = async function (req, res) {
    const { date, total } = req.body;

    const place = new Place(req.body.place);
    const purchaseItems = req.body.purchaseItems.map((purchase) => new Purchase(purchase));

    if (purchaseItems.length < 1) {
        res.status(400).send({ error: true, message: 'No purchase found.' });
    } else if (place.id === null || place.id === '') {
        res.status(400).send({ error: true, message: 'Please fill all mandatory fields (place)' });
    } else if (date === null || date === '') {
        res.status(400).send({ error: true, message: 'Please fill all mandatory fields (date)' });
    } else {

        try {
            Purchase.create(date, place, total, purchaseItems, function (err, task) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(task);
                }
            });
        } catch (err) {
            res.send(err);
        }
    }
};

exports.get_details_by_id = async function (req, res) {
    const purchaseId = req.params.itemId;
    if (!purchaseId) {
        res.status(400).send({ error: true, message: 'Missing query param: purchase id' });
    } else {
        let orderBy = req.query.orderBy;
        if (!Purchase.sortableColumns.includes(orderBy)) {
            orderBy = Purchase.sortableColumns[0];
        }

        let sort = req.query.sort || 'ASC';
        sort = sort.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

        console.log(`Fetching purchase with orderBy = ${orderBy}, sort: ${sort}`);

        Purchase.getDetailsById(purchaseId, orderBy, sort, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                const returnObject = {
                    id: purchaseId,
                    data: data.map((item) => ({
                        price: item.price,
                        quantity: item.quantity,
                        unit: item.unit,
                        discount: item.discount,
                        details: item.details,
                        brand: item.brandId ? {
                            id: item.brandId,
                            description: item.brandDescription,
                            created: item.brandCreated
                        } : null,
                        product: {
                            id: item.productId,
                            description: item.productDescription,
                            created: item.productCreated,
                            category: {
                                id: item.categoryId,
                                description: item.categoryDescription,
                                created: item.categoryCreated
                            }
                        },
                    }))
                }

                res.send(returnObject);
            }
        });
    }
};
// exports.update_a_task = function (req, res) {
//     Place.updateById(req.params.taskId, new Task(req.body), function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };
