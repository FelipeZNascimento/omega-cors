'use strict';
module.exports = function (app) {
    var placeController = require('../controller/placeController');
    var placeCategoryController = require('../controller/placeCategoryController');
    var brandController = require('../controller/brandController');
    var productController = require('../controller/productController');
    var productCategoryController = require('../controller/productCategoryController');
    var purchaseController = require('../controller/purchaseController');

    // Places Routing
    app.route('/shopping/places')
        .get(placeController.list_all)
        .post(placeController.create);
    app.route('/shopping/places/:itemId')
        .delete(placeController.delete);

    // Places Categories Routing
    app.route('/shopping/places_categories')
        .get(placeCategoryController.list_all)
        .post(placeCategoryController.create);
    app.route('/shopping/places_categories/:itemId')
        .delete(placeCategoryController.delete);

    // Products Categories Routing
    app.route('/shopping/products_categories')
        .get(productCategoryController.list_all)
        .post(productCategoryController.create);
    app.route('/shopping/products_categories/:itemId')
        .delete(productCategoryController.delete);

    // Brands Routing
    app.route('/shopping/brands/')
        .get(brandController.list_all)
        .post(brandController.create);
    app.route('/shopping/brands/:itemId')
        .delete(brandController.delete);

    // Products Routing
    app.route('/shopping/products')
        .get(productController.list_all)
        .post(productController.create);
    app.route('/shopping/products/:itemId')
        .delete(productController.delete);

    // Purchases Routing
    app.route('/shopping/purchases')
        .get(purchaseController.list_all)
        .post(purchaseController.create);
};
