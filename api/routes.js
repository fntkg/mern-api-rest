const router = require('express').Router()
const userController = require('./users/userController')
const messageController = require('./messages/messageController')
const jwt = require("jsonwebtoken");

// USER ROUTES
router.post('/login', userController.login)
router.get('/users', authenticateToken, userController.find)
router.post('/users', userController.create)
router.get('/users/:username', authenticateToken, userController.findOne)
router.put('/users/:username', authenticateToken, userController.update)
router.delete('/users/:username', authenticateToken, userController.delete)
router.get('/users/:username/followers', authenticateToken, userController.getFollowers)
router.get('/users/:username/following', authenticateToken, userController.getFollowing)
router.post('/users/:username/following', authenticateToken, userController.addFollowing)

// MESSAGE ROUTES
router.get('/users/:username/messages', authenticateToken, messageController.getMessages)
router.post('/users/:username/messages', authenticateToken, messageController.create)
router.get('/users/:username/messages/:id', authenticateToken, messageController.findOne)
router.put('/users/:username/messages/:id', authenticateToken, messageController.update)
router.delete('/users/:username/messages/:id', authenticateToken, messageController.delete)

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)

        jwt.verify(token, '9f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611', (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user.username
            next()
        })
    } else {
        return res.sendStatus(401)
    }
	
}

module.exports = router
