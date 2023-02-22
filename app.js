const express = require('express');
const app = express();
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');
const verifyAdmin = require('./middleware/verifyAdmin');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

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
//middleware for parse body as json
app.use(bodyParser.json());


// defining routes and controller
app.use('/register', require("./routes/register"));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/product', require('./routes/product'))

// protected routes
app.use(verifyJWT);

app.use(verifyAdmin);
app.use('/cms/product', require('./routes/cms/product'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
