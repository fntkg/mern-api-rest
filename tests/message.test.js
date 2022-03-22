const Message = require('../api/messages/messageModel')
const User = require('../api/users/userModel')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
let mongoServer
chai.use(chaiHttp)

describe('Messages', () => {
    before(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    after(async() => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    beforeEach((done) => {
        Message.deleteMany({})
        User.deleteMany({})
        done()
    })

    /*
        Test /users/:username/messages route
     */
    describe('/users/:username/messages', () => {
        it('it should GET all the message from an user', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    chai.request(server).get('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0)
                        done()
                    })
                })
            })
        })

        it('it should POST a new message', (done => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    let body = {content: 'MENSAJITO NUEVO'}
                    chai.request(server).post('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                        res.should.have.status(201)
                        res.body.should.be.a('Object')
                        res.body.should.have.property('id')
                        done()
                    })
                })
            })
        }))
    })

    describe('/users/:username/messages/:id', () => {
        it('it should get a message', (done => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    let body = {content: 'MENSAJITO NUEVO'}
                    chai.request(server).post('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                        let id = res.body.id
                        chai.request(server).get('/users/testUsername/messages/'+id).set({ "Authorization": `Bearer ${token}` }).end((err,res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('Object')
                            done()
                        })
                    })
                })
            })
        }))
    })

    describe('/users/:username/messages/:id', () => {
        it('it should like and share a message', (done => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    let body = {content: 'MENSAJITO NUEVO'}
                    chai.request(server).post('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                        let id = res.body.id
                        chai.request(server).get('/users/testUsername/messages/'+id).set({ "Authorization": `Bearer ${token}` }).end((err,res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('Object')
                        })
                        body = {
                            like: true,
                            share: true
                        }
                        chai.request(server).put('/users/testUsername/messages/'+id).set({ "Authorization": `Bearer ${token}` }).send(body).end((err,res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('Object')
                            console.log(res)
                            done()
                        })
                    })

                })
            })
        }))
    })
})
