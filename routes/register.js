const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registration.js');

router.get('/', registerController.handleRegistration);


module.exports = router;

