const express = require('express');
const app = express();
const db = require('./db');
const userRoutes = require('./api/users/userRoutes')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

db.connect()

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);
app.use('/', userRoutes)

/*
const UserController = require('./users/users_controller');
const LoginController = require('./auth/login_controller');
app.use('/api/user', UserController)
app.use('/api/login', LoginController)
*/

module.exports = app;
