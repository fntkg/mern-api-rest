const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const User = require('./users_schemas');

router.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ENDPOINT PARA PROBAR COSAS -> NO SE PUEDE QUEDAR EN LA ENTREGA DEL PROYECTO
// Get all users
router.get('/', function(req, res) {
    console.log('Request received')
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// Add a new user to the database
router.post('/', async function (req,
                                                        res) {
    console.log('Request received')
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
            surname: req.body.surname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        })
})

// Get user by user name
router.get('/:username', function (req,
                                                                res) {
    User.find({username: req.params.username},
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
router.put('/:username', async function (req,
                                                                res) {
    const userFound = await User.find({username: req.params.username},
        async function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (userFound){
                if (req.params.name !== ""){
                    await userFound.updateOne({},
                        {"$set": {name: req.params.name}},
                        function (err, user) {
                            if (err) return res.status(500).send("There was a problem updating the user.");
                        })
                }
                if (req.params.surname !== ""){
                    await userFound.updateOne({},
                        {"$set": {surname: req.params.surname}},
                        function (err, user) {
                            if (err) return res.status(500).send("There was a problem updating the user.");
                        })
                }
                if (req.params.email !== ""){
                    await userFound.updateOne({},
                        {"$set": {email: req.params.email}},
                        function (err, user) {
                            if (err) return res.status(500).send("There was a problem updating the user.");
                        })
                }
                if (req.params.bio !== "") {
                    await userFound.updateOne({},
                        {"$set": {bio: req.params.bio}},
                        function (err, user) {
                            if (err) return res.status(500).send("There was a problem updating the user.");
                        })
                }
                res.status(200).send(user); //Que usuario devuelve????
            }else{
                return res.status(404).json(
                    {error: 'Usuario no encontrado'}
                )
            }
        })

    })

// Delete an user
router.delete('/:username', async function (req,
                                                      res) {
    const userFound = await User.findOneAndRemove({username: req.params.username}, function (err) {
        if (err) return res.status(500).send("There was a problema deleting the user.");
        if (userFound) {
            res.status(200);
        } else {
            return res.status(404).json(
                {error: 'User no encontrado'}
            )
        }

    })
})

/*
// Add following
router.post('/user/follow/:username/:follows', async function (req,
                                                           res) {
    const userFound = await User.findOne({ username: req.params.username},
        async function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            if (userFound) {
                await userFound.updateOne({},
                    {"$push": {follows: req.params.follows}},
                    function (err, user) {
                        if (err) return res.status(500).send("There was a problem updating the user.");
                    })
            } else {
                return res.status(404).json(
                    {error: 'User no encontrado'}
                )
            }
        })
})*/

module.exports = router;
