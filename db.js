exports.connect = async () => {
    const mongoose = require('mongoose');
    let uri = 'mongodb+srv://admin:admin@software-architecture.hhul3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    const { MongoMemoryServer } = require('mongodb-memory-server')

    if (process.env.NODE_ENV === 'dev') {
        const mongoServer = await MongoMemoryServer.create()
        uri = mongoServer.getUri()
        //uri = 'mongodb://127.0.0.1:27017'
        console.log('Running server in DEVELOPMENT mode')
    }

    mongoose.connect(uri).then(
        () => { console.log('Connected to MongoDB') },
        err => { console.log('Error: ' + err) }
    );
}
