const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product');

router.route('/')
        .post(productController.createNewProduct)
router.route('/:id')
        .put(productController.updateProduct)
        .delete(productController.deleteProduct)

module.exports = router;

