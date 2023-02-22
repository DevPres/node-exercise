const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.getAllProducts);

router.route('/:id')
        .get(productController.getProduct);

module.exports = router;

