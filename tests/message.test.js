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
                    let body = {content: 'MENSAJITO NUEVO 1'}
                    chai.request(server).post('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                        let body = {content: 'MENSAJITO NUEVO 2'}
                        chai.request(server).post('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                            chai.request(server).get('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                                //console.log(res.body)
                                res.should.have.status(200)
                                res.body.should.be.a('array');
                                res.body.length.should.be.eql(2)
                                //res.body.should.have.property("username").equals("testUsername")
                                //res.body.should.have.property("name").equals("testName")
                                //res.body.should.have.property("likes").equals(0)
                                //res.body.should.have.property("shared").equals(0)
                                done()
                            })
                        })
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
                            res.body.should.have.property("_id").equals(id)
                            done()
                        })
                    })
                })
            })
        }))

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
                            body = {
                                like: true,
                                shared: true
                            }
                            chai.request(server).put('/users/testUsername/messages/'+id).set({ "Authorization": `Bearer ${token}` }).send(body).end((err,res) => {
                                res.should.have.status(200)
                                res.body.should.be.a('Object')
                                res.body.should.have.property("_id").equals(id);
                                res.body.should.have.property("likes").equals(1);
                                res.body.should.have.property("shared").equals(1);
                                res.body.should.have.property("original_message").equals(null);
                                res.body.should.have.property("numOfComments").equals(0);
                                res.body.should.have.property("comments").that.is.empty
                                res.body.should.have.property("content").equals("MENSAJITO NUEVO");
                                done()
                            })
                        })
                    })
                })
            })
        }))

        it('it should delete a message', (done => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    let body = {content: 'MENSAJITO NUEVO'}
                    chai.request(server).post('/users/testUsername/messages').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                        let id = res.body.id
                        chai.request(server).delete('/users/testUsername/messages/'+id).set({ "Authorization": `Bearer ${token}` }).end((err,res) => {
                            chai.request(server).get('/users/testUsername/messages/'+id).set({ "Authorization": `Bearer ${token}` }).end((err,res) => {
                                res.body.should.be.empty
                            })
                            res.should.have.status(204)
                            done()
                        })
                    })
                })
            })
        }))
    })
})
