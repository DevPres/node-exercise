const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshToken.js');

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;

