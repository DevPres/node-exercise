const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../db/index.js')

const handleLogin = async (req, res) => {
    const { username, pwd } = req.body;
    if (!username || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check if user exist
    let user = await db.query(`SELECT * FROM users WHERE username=$1`, [username]).then(({rows}) => rows.length ? rows[0] : null);
    if (!user) return res.status(401).json({'message': 'This user not exist!' }); //User exist 
    // evaluate password 
    const match = await bcrypt.compare(pwd, user.pwd);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "id": user.id, "username": user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }
        );
        const refreshToken = jwt.sign(
            { "id": user.id, "username": user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        await db.query(`UPDATE users SET refresh_token=$1 WHERE id=$2`, [refreshToken,user.id])
        //await db.query(`SELECT * FROM users`).then(res => console.log("USERS after login     ",res.rows))
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
