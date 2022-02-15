const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    name: String,
    surname: String,
    bio: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');