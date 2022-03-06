const mongoose = require('mongoose');
const uri = 'mongodb+srv://admin:admin@software-architecture.hhul3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(uri).then(
    () => { console.log('Connected to MongoDB') },
    err => { console.log('Error: ' + err) }
);
