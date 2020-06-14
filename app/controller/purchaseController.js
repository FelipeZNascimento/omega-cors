var Purchase = require('../model/purchaseModel.js');
var Brand = require('../model/brandModel.js');
var Product = require('../model/productModel.js');

callBrandCreator = async function (newBrands) {
    if (newBrands.length === 0) {
        return [];
    }

    Brand.createBrands(newBrands, function (err, task) {
        if (err) {
            throw new Error(err);
        }
        const brandsArray = newBrands.map((brand, index) => {
            return {
                id: task.insertId + index,
                description: brand.description
            }
        });
        
        return brandsArray;
    });
}

callProductCreator = async function (newPurchase, newProducts) {
    if (newProducts.length === 0) {
        return newPurchase;
    }

    Product.createProducts(newProducts, function (err, task) {
        if (err) {
            throw new Error(err);
        } else {
            for (let i = 0; i < task.affectedRows; i++) {
                const index = newPurchase.purchase
                    .findIndex(line => line.product.description === newBrands[i].description);

                newPurchase.purchase[index].product.id = task.insertId + i;
            }
        }
    });

    return newPurchase;
}

exports.list_all = function (req, res) {
    Purchase.getAll(function (err, task) {
        if (err) {
            res.send(err);
        }
        res.send(task);
    });
};

exports.create = async function (req, res) {
    var newPurchase = new Purchase(req.body);
    console.log('-----------------------------------------');
    console.log(newPurchase);
    console.log('-----------------------------------------');

    if (newPurchase.purchase.length < 1) {
        res.status(400).send({ error: true, message: 'No purchase found.' });
    } else if (newPurchase.place_id === null || newPurchase.place_id === '') {
        res.status(400).send({ error: true, message: 'Please fill all mandatory fields (place)' });
    } else if (newPurchase.date === null || newPurchase.date === '') {
        res.status(400).send({ error: true, message: 'Please fill all mandatory fields (date)' });
    } else {

        // const newProducts = newPurchase.purchase
        //     .filter((line) => line.product.newlyAdded)
        //     .map((line) => line.product);

        // const newBrands = newPurchase.purchase
        //     .filter((line) => line.brand.newlyAdded)
        //     .map((line) => line.brand);

        try {
            // const brandsArray = await this.callBrandCreator(newBrands);
            //para cara elemento de brandsArray, procura um com mesma descrição em newPurchase e sobrescreve
            // newPurchase = await this.callProductCreator(newPurchase, newProducts);
            Purchase.create(newPurchase, function (err, task) {
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

// exports.read_a_task = function (req, res) {
//     Place.getTaskById(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.update_a_task = function (req, res) {
//     Place.updateById(req.params.taskId, new Task(req.body), function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.delete_a_task = function (req, res) {
//     Place.remove(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };
