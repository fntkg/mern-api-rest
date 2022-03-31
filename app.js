
const express = require('express');
const app = express();
const db = require('./db');
db.dbConnect()
const userRoutes = require('./api/routes')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);
app.use('/', userRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    return res.status(404)
});

module.exports = app;
