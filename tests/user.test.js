const mongoose = require('mongoose')
const User = require('../api/users/userModel')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
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
        Test the GET /users route
     */
    describe('GET /users', () => {
        it('it should GET all the users', (done) => {
            let user = {username: 'testUsername', name: 'testName', email: 'testEmail@test.com', password: 'testPassword'}
            chai.request(server).post('/users').send(user).end(() => {
                let login = { username: 'testUsername', password: 'testPassword'}
                chai.request(server).post('/login').send(login).end((err, res) => {
                    let token = res.body.token
                    chai.request(server).get('/users').set({ "Authorization": `Bearer ${token}` }).end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                    })
                    done()
                })
            })
        })
    })
})
