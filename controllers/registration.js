const bcrypt = require('bcryptjs');
const db = require('../db/index.js')


const handleRegistration = async (req, res) => {
    console.log('passo');
    const { username, pwd } = req.body;
    if (!username || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check if user exist yet
    let user = await db.query(`SELECT * FROM users WHERE username=$1`, [username]).then(({rows}) => rows.length ? rows[0] : null)
    if (user) return res.status(409).json({'message': 'User exist, try to login!' }); //User exist 
    try {
        //encrypt the password and store
        bcrypt.hash(pwd, 10, async (err, hash) => {
            await db.query(`INSERT INTO users (username,pwd) VALUES ($1,$2)`,[username,hash]);
        });
        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'message': 'Something go wrong1' });
    }
}

module.exports = { handleRegistration };
