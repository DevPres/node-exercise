const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../db/index.js')

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    let user = await db.query(`SELECT * FROM users WHERE refresh_token=$1`, [refreshToken])
        .then(res => res.rows.length ? res.rows[0] : null)
    if (!user) return res.status(403).json({'message': 'Something go wrong' }); //User exist 

    //evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || user.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {"id": decoded.id, "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }
