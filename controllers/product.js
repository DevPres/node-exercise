const db = require('../db/index.js')


const getAllProducts = async (req, res) => {
    const products = await db.query(`SELECT * FROM products`)
        .then(({rows}) => rows)
    return res.status(200).json({"products": [...products]})
}

const createNewProduct = async (req, res) => {
    const {code,name,price} = req.body
    if(!code || !name || !price) return res.status(400).json({'message': 'code,name and price are required!'})

    try {
        await db.query(`INSERT INTO products (code,name,price) VALUES ($1,$2,$3)`, [code,name,price]);
        return res.status(200).json({'message': 'Product Saved'})
    } catch (err) {
        console.log(err);
        return res.status(500).json({'message': 'Something go wrong!'})
    }
 }

const updateProduct = async (req, res) => {
    const {id} = req.params.id
    if(!id) res.sendStatus(500);
    const {code,name,price} = req.body;

    const product = await db.query(`SELECT * FROM products WHERE id=$1`, [id]);

    if(!product) res.status(404).jsoenno({'message': 'product not found!'});

    if(!code || !name || !price) res.status(400).json({'message': 'code,name and price are required!'});

    try {
        await db.query(`UPDATE products SET code=$1, name=$2, price=$3 WHERE id=$4`, [code,name,price,id]);
        return res.status(200).json({'message': 'Product Updated'})
    } catch (err) {
        console.log(err);
        return res.status(500).json({'message': 'Something go wrong!'})
    }
}

const deleteProduct = async (req, res) => { 
    const {id} = req.params.id;

    if(!id) res.status(404).json({'message': 'product not found!'});
    
    try {
        await db.query(`DELETE FROM products WHERE id=$1`, [id]);
        return res.status(200).json({'message': 'Product Deleted'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({'message': 'Something go wrong!'})
    }
}

const getProduct = async (req, res) => {   
    const {id} = req.body;

    if(!id) res.status(404).json({'message': 'product not found!'});
    
    try {
        const product = await db.query(`SELECT * FROM products WHERE id=$1`, [id]).then(({rows}) => rows.length ? rows[0] : null  );

        if(!product) return res.status(404).json({'message': 'product not found!'});

        return res.status(200).json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json({'message': 'Something go wrong!'})
    }
}

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getProduct
}
