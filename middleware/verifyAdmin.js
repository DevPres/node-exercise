const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAdmin = (req, res, next) => {
    // For a future protection of this route
    return res.status(500).json({'message': 'This route is not acitve'})
    next();
}

module.exports = verifyAdmin
