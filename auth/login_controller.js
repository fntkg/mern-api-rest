const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('./auth')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const User = require('../users/users_schemas');

router.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// User authentication
router.post('/', async function (req, res) {
    console.log('Login request received')
    const userFound = await User.findOne({ email: req.params.email},
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            if (userFound) {
                user.comparePassword(req.params.password, function (err, isMatch) {
                    if (err) return res.status(500).send("There was a problem adding the information to the database.");
                    if (isMatch) {
                        // CREATE AND SEND JWT TOKEN
                        //const token = jwt.generateAccessToken({ username: user.username }); //VER QUE LE PASO A ESTA FUNCION
                        //return res.status(200).send(token);
                        return res.status(200)
                    } else {
                        return res.status(401).json(
                            {error: 'El email y el password no coinciden'}
                        )
                    }
                })
            }else{
                return res.status(404).json(
                    {error: 'Email no encontrado'}
                )
            }
        })
})

module.exports = router;
