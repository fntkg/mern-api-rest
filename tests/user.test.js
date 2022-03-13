const User = require('../api/users/userModel')
//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
let mongoServer

chai.use(chaiHttp)
describe('Users', () => {
    before(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    after(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
            done()
        })
    })

    /*
        Test the POST /users route
     */
    describe('POST /users', () => {
        it('it should create an user', (done) => {
            let user = {
                username: 'testUsername',
                name: 'testName',
                email: 'testEmail@test.com',
                password: 'testPassword'
            }
            chai.request(server).post('/users').send(user).end((err, res) => {
                res.should.have.status(201)
                done()
            })
        })
    })

    /*
        Test the POST /login route
     */
    describe('POST /login', () => {
        it('it should log in an user', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('Object')
                    res.body.should.have.property('token')
                    done()
                })
            })
        })
    })

    /*
        Test the /users route
     */
    describe('/users', () => {
        it('it should GET all the users', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    chai.request(server).get('/users').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1)
                        done()
                    })
                })
            })
        })
    })

    describe('/users/:username', () => {
        it('it should return an user', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    chai.request(server).get('/users/testUsername').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.should.have.property('username')
                        done()
                    })
                })
            })
        })

        it('it should modify an user', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    let body = { bio: 'This is an example bio' }
                    chai.request(server).put('/users/testUsername').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('Object')
                        res.body.should.have.property('bio')
                        done()
                    })
                })
            })
        })

        it('it should delete an user', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    chai.request(server).delete('/users/testUsername').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                        res.should.have.status(204)
                        done()
                    })
                })
            })
        })
    })

    describe('/users/:username/followers', () => {
        it('it should get a list of users who follower :username', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    chai.request(server).get('/users/testUsername/followers').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                        if (err) console.log('ERROR: ' + err)
                        res.should.have.status(200)
                        res.body.should.be.a('array')
                        res.body.length.should.be.eql(0)
                        done()
                    })
                })
            })
        })
    })

    describe('/users/:username/following', () => {
        it('it should get a list of users who :username is following', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    chai.request(server).get('/users/testUsername/following').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                        if (err) console.log('ERROR: ' + err)
                        res.should.have.status(200)
                        res.body.should.be.a('array')
                        res.body.length.should.be.eql(0)
                        done()
                    })
                })
            })
        })

        it('it should add a new user to the list :username is following', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    const body = { followed: 'testUsername'}
                    chai.request(server).post('/users/testUsername/following').set({ "Authorization": `Bearer ${token}` }).send(body).end((err, res) => {
                        if (err) console.log('ERROR: ' + err)
                        res.should.have.status(201)
                        done()
                    })
                })
            })
        })
    })
})
