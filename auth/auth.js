const jwt = require('jsonwebtoken');

const TOKEN_SECRET='09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'

function generateAccessToken(username) {
    //return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' });
    return jwt.sign(username, TOKEN_SECRET, { expiresIn: '30s' }); // 30s PARA PRUEBAS
}

function verifyToken(token){
    return jwt.verify(token, TOKEN_SECRET)
}

function refreshToken(token){
    delete token.iat
    delete token.exp
    delete token.nbf
    delete token.jti
    return jwt.sign(token, TOKEN_SECRET, { expiresIn: '30s' });
}

module.exports = { generateAccessToken, verifyToken, refreshToken }
