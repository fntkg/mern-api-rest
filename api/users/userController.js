const User = require('./userModel');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

exports.login = (req, res) => {
    User.findOne({username: req.body.username}, 'password', function (err, user) {
        if (!user) return res.sendStatus(404)
        user.comparePassword(req.body.password, function (err, isMatch) {
            //if (err) return res.sendStatus(400)
            if (!isMatch) return res.sendStatus(403)
            const token = generateAccessToken({ username: req.body.username });
            res.send({token: token});
        })
    })
}

// Returns a list of users
exports.find = (req, res) => {
    if (req.query.username !== undefined) {
        const filters = new RegExp(req.query.username, 'i')
        User.find({username: filters}, 'username name avatar bio', function (err, users) {
            if (err) return res.sendStatus(400)
            res.status(200).send(users);
        })
    } else {
        User.find({}, 'username name avatar bio', function (err, users) {
            if (err) return res.sendStatus(400)
            res.status(200).send(users);
        })
    }
}

exports.create = (req, res) => {
    User.create({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        },
        function (err, user) {
            if (err) {
                if (err.keyPattern.email) { return res.status(409).send({error: 'Email already exists'}) }
                else if (err.keyPattern.username) { return res.status(409).send({error: 'Username already exists'}) }
                else {return res.sendStatus(400)}
            }
            res.sendStatus(201)
        })
}

exports.findOne = (req, res) => {
    User.findOne({username: req.params.username}, 'email username name avatar bio followers following', function(err, user) {
        if (err) return res.sendStatus(400)
        if (!user) return res.sendStatus(404)
        // create personalized user to display followers and following count
        const followersCount = user.followers.length
        const followingCount = user.following.length
        const personalizedUser = {
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            followers: followersCount,
            following: followingCount
        }
        return res.status(200).send(personalizedUser)
    })
}

exports.update = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    User.findOneAndUpdate({username: req.params.username},  req.body, {new: true},function(err, user) {
        if (err) return res.sendStatus(400)
        if (!user) return res.sendStatus(404)
        return res.status(200).send(user)
    })
}

exports.delete = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    User.findOneAndRemove({username: req.params.username}, function (err, user) {
        if (err) return res.sendStatus(400)
        if (!user) return res.sendStatus(404)
        return res.sendStatus(204)
    })
}

exports.getFollowers = (req, res) => {
    User.findOne({username: req.params.username}, 'followers')
        .populate('followers', 'username name avatar bio').exec(function (err, followers){
        if (err) return res.sendStatus(400)
        return res.status(200).send(followers.followers)
    })
}

exports.getFollowing = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    User.findOne({username: req.params.username}, 'following')
        .populate('following', 'username name avatar bio').exec(function (err, following){
        if (err) return res.sendStatus(400)
        return res.status(200).send(following.following)
    })
}

exports.addFollowing = (req, res) => {
    User.findOne({username: req.params.username}, 'following', function (err, following) {
        if (err) return res.sendStatus(400)
        User.findOne({username: req.body.followed}, 'followers', function (err, followers){
            if (err) return res.sendStatus(400)
            following.following.push(followers._id); following.save()
            followers.followers.push(following._id); followers.save()
            return res.sendStatus(201)
        })
    })
}

// AUXILIAR FUNCTIONS
function generateAccessToken(username) {
    return jwt.sign(username, '9f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611', { expiresIn: '1800s' });
}
