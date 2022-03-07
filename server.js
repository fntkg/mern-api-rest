const app = require('./app');
let port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "dev") {
    port = process.env.PORT || 27017
}

const server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});

module.exports = server;
