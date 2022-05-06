
let chai = require("chai");
let chaiHttp = require("chai-http");

//Assertion Style
chai.should();
chai.use(chaiHttp);

const TrueuserCredentials = {
  email: 'oskar.emil@hej.dk',
  password: '1234'
}

const WrongUserCredentials = {
  email: 'oskar1@test.dk',
  password: '132'
}

describe('Login API', function () {
  describe('GET /login', function () {
    it('It should return the status 200 if the path exists', (done) => {
      chai.request("http://localhost:3000")
        .get("/login")
        .end((err, response) => {
          response.should.have.status(200);
          done();
        })
    })
  })

  describe('POST /login', function () {
    it('It should log in the user successfully and return all user fields', (done) => {
      chai.request("http://localhost:3000")
        .post("/login")
        .send(TrueuserCredentials)
        .end((err, response) => {
          response.should.have.status(200);
          done();
        })
    })

    it('If successfully logged in, it should return all user fields for the logged in user', (done) => {
      chai.request("http://localhost:3000")
        .post("/login")
        .send(TrueuserCredentials)
        .end((err, response) => {
          response.body.should.be.a('object');
          response.body.should.have.property('Id');
    response.body.should.have.property('Email').eq(TrueuserCredentials.email);
          response.body.should.have.property('Password').eq(TrueuserCredentials.password);
          response.body.should.have.property('Status_id');
          response.body.should.have.property('Gold');
          done();
        })
    })

    it('It should fail the user login', (done) => {
      chai.request("http://localhost:3000")
        .post("/login")
        .send(WrongUserCredentials)
        .end((err, response) => {
          response.should.have.status(401);
          response.text.should.be.eq("Unauthorized");
          done();
        })
    })
  })
})

