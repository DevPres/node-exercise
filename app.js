const express = require('express');
const app = express();
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

// Defining port
const PORT = 8080;
// Defining the host for Docker
const HOST = '0.0.0.0';
// built-in middleware for json 
app.use(express.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//middleware for cookies
app.use(cookieParser());

// defining routes and controller
app.use('/register', require("./routes/register.js"));
app.use('/auth', require('./routes/auth'));

// protected routes
app.use(verifyJWT);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
