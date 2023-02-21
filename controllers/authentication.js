const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../db/index.js')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check if user exist
    let foundUser = await db.query(`SELECT * FROM users WHERE username=$1`, [user.username]);
    if (!foundUser) return res.status(401).json({'message': 'This user not exist!' }); //User exist 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.pwd);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "id": foundUser.id, "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "id": foundUser.id, "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //await usersDB.update({"id": foundUser.id, "refresh_token": refreshToken })
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
