const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const User = require('./users_schemas');

// Add a new user to the database
router.post('/api/users', function (req, res){
    User.create({
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname
    },
        function (err, user){
        if (err) return res.status(500).send("There was a problem adding the information to the database.");
        res.status(200).send(user);
        })
})

// Get user by user name
router.get('/api/users/:username', function (req,res){
    User.find({ username: req.params.username}, function (err, user){
        if (err) return res.status(500).send("There was a problem finding the user.");
        res.status(200).send(user);
    })
})

// Update an user
router.put('/api/users/:username', function (req, res){
    User.find({username: req.params.username}, function (err, user){
        if (err) return res.status(500).send("There was a problema updating the user.");
        res.status(200).send(user);
    })
})

// Delete an user
router.delete('/api/users/:username', function (req, res){
    User.findOneAndRemove({username: req.params.username}, function (err){
        if (err) return res.status(500).send("There was a problema deleting the user.");
        res.status(200);
    })
})