const express = require('express');
const app = express();
require('./db');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);

const UserController = require('./users/users_controller');
const LoginController = require('./auth/login_controller');
app.use('/api/user', UserController)
app.use('/api/login', LoginController)

module.exports = app;
