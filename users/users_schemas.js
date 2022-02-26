const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, index: { unique: true}},
    username: { type: String, required: true, index: { unique: true}},
    name: { type: String, required: true},
    surname: { type: String, required: true},
    bio: { type: String }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');