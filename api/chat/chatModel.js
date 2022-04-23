const mongoose = require('mongoose')
const { Schema } = mongoose

const chatSchema = new Schema({
    producer: {type: Schema.Types.ObjectId, ref: 'User'},
    consumer: {type: Schema.Types.ObjectId, ref: 'User'},
    date: { type: Date, default: Date.now },
    content: String,
})

mongoose.model('chatMessage', chatSchema)
module.exports = mongoose.model('chatMessage')
