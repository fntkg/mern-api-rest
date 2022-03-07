const mongoose = require('mongoose');
let uri = 'mongodb+srv://admin:admin@software-architecture.hhul3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

if (process.env.NODE_ENV === "dev") {
    uri = 'mongodb://localhost:27017/red'
    console.log('Running server is DEVELOPMENT mode')
}

mongoose.connect(uri).then(
    () => { console.log('Connected to MongoDB') },
    err => { console.log('Error: ' + err) }
);
