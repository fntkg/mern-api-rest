const Message = require('./messageModel');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

exports.getMessages = (req, res) => {
    if (req.user !== req.params.username) return res.sendStatus(403)
    Message.find({username: req.params.username}, 'comments')
        .populate('comments', 'user, date, likes, retweets, content, messageCommented, comments')
        .limit(100).exec(function (err, message) {
        if (err) return res.sendStatus(400)
        return res.status(200).send(message)
    })
}


// AUXILIAR FUNCTIONS
function generateAccessToken(username) {
    return jwt.sign(username, '9f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611', { expiresIn: '1800s' });
}
