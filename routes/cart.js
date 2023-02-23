const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

router.route('/')
    .get(cartController.getCart);

router.route('/product/:product_id')
    .post(cartController.addToCart)

router.route('/product/:cart_product_id')
    .delete(cartController.deleteFromCart);

module.exports = router;


