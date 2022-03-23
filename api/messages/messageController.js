const Message = require('./messageModel');
const mongoose = require("mongoose");
const User = require("../users/userModel");

exports.getMessages = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    Message.find({username: req.user}, 'id user date content retweets likes numOfComments').
        populate('username', 'username name avatar').exec(function (err, messages){
            if (err) return res.sendStatus(400)
        res.status(200).send(messages)
    })
}

exports.create = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    Message.create({
        _id: new mongoose.Types.ObjectId(),
        username: req.user,
        original_message: req.body.id_comment,
        content: req.body.content
    }, function (err, message){
        if (err) return res.sendStatus(400)
        res.status(201).send({id: message.id})
    })
}

exports.findOne = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    Message.findOne({_id: req.params.id}, '_id user date content likes shared numOfComments comments original_message').
        populate('user', 'username name avatar').
        populate({
            path: 'original_message',
            projection: '_id date content likes shared numOfComments user',
            populate: {
                path: 'user',
                projection: 'username name avatar'
            }
        }).
        populate({
            path: 'comments',
            projection: '_id date content likes shared numOfComments user',
            populate: {
                path: 'user',
                projection: 'username name avatar'
            }
        }).exec(function (err, message){
        if (err) return res.sendStatus(400)
        return res.status(200).send(message)
    })
}

exports.update = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    Message.findOneAndUpdate(
        {_id: req.params.id},
        {$inc: {'likes' : +req.body.like, 'shared' : +req.body.shared}},
        {new: true}
    ).exec(function (err, message){
        if (err) return res.sendStatus(400)
        return res.status(200).send(message)
    })
}