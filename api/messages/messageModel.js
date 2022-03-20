const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User'}, // Extract exact info on request
    date: { type: Date, default: Date.now },
    likes: Number,
    retweets: Number,
    messageCommented: { type: Schema.Types.ObjectId, ref: 'Message' }, // Extract info on request
    comments: [{ type: Schema.Types.ObjectId, ref: 'Message' }], // Extract info on request
    content: String
})

mongoose.model('Message', messageSchema)
module.exports = mongoose.model('Message')
