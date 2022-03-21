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
        console.log('Connected with database')
    }
};
