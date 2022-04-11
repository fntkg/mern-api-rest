
const express = require('express');
const app = express();
const db = require('./db');
db.dbConnect()
const userRoutes = require('./api/routes')
const cors = require('cors')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);
app.use('/', userRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    return res.status(404)
});

module.exports = app;
