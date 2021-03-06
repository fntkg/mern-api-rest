const app = require('./app');
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    if (process.env.NODE_ENV !== 'test') console.log('Express server listening on port ' + port)
});

module.exports = server;
