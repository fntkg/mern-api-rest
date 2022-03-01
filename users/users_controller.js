const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const User = require('./users_schemas');

// Add a new user to the database
router.post('/api/users', async function (req,
                                                        res) {
    const isEmailExist = await User.findOne({email: req.body.email});
    if (isEmailExist) {
        return res.status(409).json(
            {error: 'Email ya registrado'}
        )
    }
    const isUsernameExist = await User.findOne({username: req.body.email});
    if (isUsernameExist) {
        return res.status(409).json(
            {error: 'Apodo ya registrado'}
        )
    }
    User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            username: req.body.username,
            surname: req.body.surname,
            password: req.body.password
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        })
})

// Get user by user name
router.get('/api/users/:username', async function (req,
                                                                res) {
    await User.find({username: req.params.username},
        function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (user.length) {
                return res.status(200).send(user);
            } else {
                return res.status(404).json(
                    {error: 'Usuario no encontrado'}
                )
            }
        })
})

// Update an user
router.put('/api/users/:username', async function (req,
                                                                res) {
    const userFound = await User.find({username: req.params.username},
        async function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
        })
    if (userFound){
        if (req.params.name !== ""){
            await User.updateOne({username: req.params.username},
                {"$set": {name: req.params.name}},
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem updating the user.");
                })
        }
        if (req.params.surname !== ""){
            await User.updateOne({username: req.params.username},
                {"$set": {surname: req.params.surname}},
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem updating the user.");
                })
        }
        if (req.params.email !== ""){
            await User.updateOne({username: req.params.username},
                {"$set": {email: req.params.email}},
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem updating the user.");
                })
        }
        if (req.params.bio !== "") {
            await User.updateOne({username: req.params.username},
                {"$set": {bio: req.params.bio}},
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem updating the user.");
                })
            res.status(200).send(user); //Que usuario devuelve????
        }
    }else{
        return res.status(404).json(
            {error: 'Usuario no encontrado'}
        )
    }
    })

// Delete an user
router.delete('/api/users/:username', function (req, res){
    User.findOneAndRemove({username: req.params.username}, function (err){
        if (err) return res.status(500).send("There was a problema deleting the user.");
        res.status(200);
    })
})