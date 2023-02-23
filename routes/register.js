const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registration.js');

router.post('/', registerController.handleRegistration);


module.exports = router;

