const mongoose = require('mongoose')
const { Schema } = mongoose
const Bcrypt = require("bcryptjs")

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: { type: String, unique: true, required: true},
    username: { type: String, unique: true, required: true},
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: 'https://gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?d=identicon'},
    bio: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User'}], // it should point to a list of users
    following: [{ type: Schema.Types.ObjectId, ref: 'User'}]  // it should point to a list of users
})

userSchema.pre('save', function(next) {
    // check if password is present and is modified
    if ( this.password && this.isModified('password') ) {
        // call your hashPassword method here which will return the hashed password.
        this.password = Bcrypt.hashSync(this.password, 10);
    }
    // everything is done, so let's call the next callback.
    next();
})

userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, Bcrypt.compareSync(plaintext, this.password));
};

mongoose.model('User', userSchema);
module.exports = mongoose.model('User');
