const db = require('../db/index.js');
const CartService = require('../services/cart');
const DiscountService = require ("../services/discount");


const addToCart = async (req, res) => {
    //id is injected by middleware
    const user_id = req.user_id;
    const {product_id} = req.params;
    // check if product existt
    const product = await db.query('SELECT * FROM products WHERE id=$1', [product_id]).then(({rows}) => rows.length ? rows[0] : null);
    if(!product) {
        return res.status(500).json({'message': 'Something go wrong!'});

    }
    // select the cart session by user id
    let cart_session_id = await db.query(`SELECT * FROM cart_session where user_id=$1`, [user_id]).then(({rows}) => rows.length ? rows[0].id : null)

    // If cart session is not present, create one
    if(!cart_session_id) {
        try {
            await db.query(`INSERT INTO cart_session (user_id) VALUES ($1)`, [user_id]);
            cart_session_id = await db.query(`SELECT * FROM cart_session where user_id=$1`, [user_id]).then(({rows}) => rows.length ? rows[0].id : null);
        } catch (err) {
            console.log(err);
            return res.status(500).json({'message': 'Something go wrong!'});
        }
    }
    // get current element quantities in cart
    const actual_quantity = await db.query('SELECT * FROM cart_product WHERE session_id=$1 AND product_id=$2', [cart_session_id,product_id]).then(({rows}) => rows.length ? rows[0].quantity : 0);
    // update cart
    const new_quantity = parseFloat(actual_quantity) + 1
    // get current price
    const current_price = parseFloat(product.price) * new_quantity;
    // insert or update product in cart
    try {
        if(actual_quantity === 0){
            await db.query('INSERT INTO cart_product (product_id,session_id,quantity,current_price) VALUES ($1,$2,$3,$4)', [product_id,cart_session_id,new_quantity,current_price]);
        } else {
            await db.query('UPDATE cart_product SET quantity=$1,current_price=$2 WHERE session_id=$3 AND product_id=$4', [new_quantity,current_price,cart_session_id,product_id]);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({'message': 'Something go wrong!'});
    }

    // Select cart before joining the product to have additional data
    let cart = await db.query(`
        SELECT session_id,product_id,quantity,price,name,code,discount_id,current_price 
        FROM cart_product 
        INNER JOIN products 
        ON cart_product.product_id=products.id 
        WHERE session_id=$1`, 
    [cart_session_id]).then(({rows}) => rows);
    
    //Reset prices before applying discount
    cart = CartService.resetPrices(cart)
    //Applying discount
    try {
        cart = await DiscountService.applyDiscount(cart) 
    } catch(err) {
        console.log(err)
    }
    // Update discounted price
    // Use this to chain multiple access at db
    await cart.reduce(async(promise,element) => {  
        await promise;
        const x = await db.query('UPDATE cart_product SET current_price=$1 WHERE session_id=$2 AND product_id=$3', [element.current_price, element.session_id, element.product_id]) 
    }, Promise.resolve);
    
    //Caclulate total and update DB
    const total = await CartService.calculateTotal(cart);
    await db.query('UPDATE  cart_session SET total=$1 WHERE id=$2', [total, cart_session_id])
    return res.status(200).json({'message': 'Product succesfully added to cart!'})
     
 }


const deleteFromCart = async (req, res) => { 
     // user id is injected by middleware
    const user_id = req.user_id;
    // get element id to delete
    const {cart_product_id} = req.params;
        // select the cart session by user id
    let cart_session_id = await db.query(`SELECT * FROM cart_session where user_id=$1`, [user_id]).then(({rows}) => rows.length ? rows[0].id : null);

    // If cart session is not present, return error
    if(!cart_session_id) {
        return res.status(500).json({'message': 'Something go wrong!'});
    }

    //get the original product
    let product_id = await db.query('SELECT product_id FROM cart_product WHERE id=$1', [cart_product_id]).then(({rows}) => rows.length ? rows[0].product_id : null);
    let product = await db.query('SELECT * FROM products WHERE id=$1', [product_id]).then(({rows}) => rows.length ? rows[0] : null);
    
    // If original product is not present, return error
    if(!product) {
        return res.status(500).json({'message': 'Something go wrong!'});
    }


    // get current element quantities in cart
    const actual_quantity = await db.query('SELECT * FROM cart_product WHERE id=$1', [cart_product_id]).then(({rows}) => rows.length ? rows[0].quantity : 0);
    // update cart
    const new_quantity = Number(actual_quantity) === 0 ? Number(actual_quantity) : Number(actual_quantity) - 1
    // get current price
    const current_price = parseFloat(product.price) * new_quantity;
    console.log(new_quantity);
    // delete or update product in cart
    try {
        if(new_quantity === 0){
            console.log('DELETING',product_id);
            await db.query('DELETE FROM cart_product WHERE id=$1', [cart_product_id]);
        } else {
            await db.query('UPDATE cart_product SET quantity=$1,current_price=$2 WHERE id=$3', [new_quantity,current_price,cart_product_id]);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({'message': 'Something go wrong!'});
    }

    // Select cart before joining the product to have additional data
    let cart = await db.query(`
        SELECT session_id,product_id,quantity,price,name,code,discount_id,current_price 
        FROM cart_product 
        INNER JOIN products 
        ON cart_product.product_id=products.id 
        WHERE session_id=$1`, 
    [cart_session_id]).then(({rows}) => rows);
    if(!cart.length) {
        await db.query('DELETE FROM cart_session WHERE id=$1', [cart_session_id])
        return res.status(200).json({'message': 'Cart succesfully cleared!'})

    } 
    //Reset prices before applying discount
    cart = CartService.resetPrices(cart)
    //Applying discount
    try {
        cart = await DiscountService.applyDiscount(cart) 
    } catch(err) {
        console.log(err)
    }
    // Update discounted price
    // Use this to chain multiple access at db
    await cart.reduce(async(promise,element) => {  
        await promise;
        const x = await db.query('UPDATE cart_product SET current_price=$1 WHERE session_id=$2 AND product_id=$3', [element.current_price, element.session_id, element.product_id]) 
    }, Promise.resolve);
     
    //Caclulate total and update DB
    const total = await CartService.calculateTotal(cart);
    await db.query('UPDATE  cart_session SET total=$1 WHERE id=$2', [total, cart_session_id])
    return res.status(200).json({'message': 'Product succesfully deleted from cart!'})


}

const getCart = async (req, res) => {
    // user id is injected by middleware
    const user_id = req.user_id;

    // select the cart session by user id
    let cart_session_id = await db.query(`SELECT * FROM cart_session where user_id=$1`, [user_id]).then(({rows}) => rows.length ? rows[0].id : null)
    
    let cart;
    let total;
    if(!cart_session_id) {
        cart = [];
        total = 0;
    } else {

        // Select cart before joining the product to have additional data
        cart = await db.query(`
            SELECT cart_product.id,session_id,product_id,quantity,price,name,code,discount_id,current_price 
            FROM cart_product 
            INNER JOIN products 
            ON cart_product.product_id=products.id    
            WHERE session_id=$1`, 
            [cart_session_id]).then(({rows}) => rows);
        // Select total from cart_session table
        total = await db.query(`SELECT total FROM cart_session WHERE id=$1 AND user_id=$2`,[cart_session_id,user_id]).then(({rows}) => rows.length ? rows[0].total : 0);
    }
    return res.status(200).json({'cart': cart, 'total': total});


}

module.exports = {
    addToCart,
    deleteFromCart,
    getCart
}

