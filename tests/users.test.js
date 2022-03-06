const request = require('supertest')
const app = require('../server')
const User = require('../users/users_schemas')
const {response} = require("express");

// POR AHORA SOLO COMPRUEBA LOS CÓDIGOS HTTP
// HAY QUE HACER QUE PRUEBEN QUE SE CUMPLE LA DOCUMENTACION DE LA API

beforeEach(async () => {
    // seed with some data
    await User.deleteMany()
});

describe('POST /user', () => {
    test('it should add a new user to the database', async () => {
        const user = {
            "email": "user@example.com",
            "username": "string",
            "password": "string",
            "name": "string",
            "surname": "string"
        }
        request(app).post('/api/user').send(user)
        expect(response.statusCode).toBe(200)
    })
})

describe('GET /user/:username', () => {
    test('it should respond with an empty array of users', async () => {
        const user = {
            "email": "user@example.com",
            "username": "string",
            "password": "string",
            "name": "string",
            "surname": "string"
        }
        request(app).post('/api/user').send(user)
        const res = request(app).get('/api/user/string');
        //expect(response.body).toEqual([])
        expect(response.statusCode).toBe(200)
    })
})

describe('PUT /user/:username', () => {
    test('it should update an user', async () => {
        let user = {
            "email": "user@example.com",
            "username": "string",
            "password": "string",
            "name": "string",
            "surname": "string"
        }
        request(app).post('/api/user').send(user)
        user.name = "Ger"
        request(app).put('/api/user/string').send(user)
        expect(response.statusCode).toBe(200)
    })
})

describe('DELETE /user/:username', () => {
    test('it should delete an user', async () => {
        let user = {
            "email": "user@example.com",
            "username": "string",
            "password": "string",
            "name": "string",
            "surname": "string"
        }
        request(app).post('/api/user').send(user)
        request(app).delete('api/user/string')
        expect(response.statusCode).toBe(200)
    })
})
