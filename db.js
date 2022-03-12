const mongoose = require('mongoose');
let { MongoMemoryServer } = require('mongodb-memory-server');
let uri = 'mongodb+srv://admin:admin@software-architecture.hhul3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

exports.dbConnect = async () => {
    if (process.env.NODE_ENV !== 'test') {
        if (process.env.NODE_ENV === 'dev') {
            const mongoServer = await MongoMemoryServer.create()
            uri = mongoServer.getUri()
            console.log('Connected with DEVELOPMENT database')
        }

        await mongoose.connect(uri);
    }
};
/*const mongoose = require('mongoose');
let uri = 'mongodb+srv://admin:admin@software-architecture.hhul3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const { MongoMemoryServer } = require('mongodb-memory-server')

if (process.env.NODE_ENV === 'dev') {
    uri = 'mongodb://127.0.0.1:27017'
    console.log('Running server in DEVELOPMENT mode')
}

mongoose.connect(uri).then(
    () => { console.log('Connected to MongoDB') },
    err => { console.log('Error: ' + err) }
);*/
