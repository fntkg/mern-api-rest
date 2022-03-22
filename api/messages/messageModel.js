const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User'}, // Extract exact info on request
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0},
    shared: { type: Number, default: 0},
    original_message: { type: Schema.Types.ObjectId, ref: 'Message', default: null }, // Extract info on request
    comments: [{ type: Schema.Types.ObjectId, ref: 'Message', default: null }], // Extract info on request
    numOfComments: { type: Number, default: 0},
    content: String
})

mongoose.model('Message', messageSchema)
module.exports = mongoose.model('Message')
