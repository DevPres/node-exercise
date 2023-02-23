const jwt = require('jsonwebtoken');
require('dotenv').config();
// middleware for verifying JWT token and inject user id in req object
const verifyJWT = (req, res, next) => {
    console.log('middleware')
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader;
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            //inject ttoken
            req.user_id = decoded.id;
            next();
        }
    );
}

module.exports = verifyJWT
