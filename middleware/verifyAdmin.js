const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAdmin = (req, res, next) => {
    // For a future protection of this route
    console.log('Verify if admin')
    next();
}

module.exports = verifyAdmin
