
var expect = require('chai').expect;
var app = require('../server.js');
var request = require('supertest');


describe('GET /user', function (done) {
  it('skal retunere 200, hvis stien er fundet', function (done) {
    user.get('/user')
      .expect(200, done);
  });
});

const TrueuserCredentials = {
  email: 'oskar.emil@hej.dk',
  password: '123'
}

const WrongUserCredentials = {
  email: 'oskar1@test.dk',
  password: '132'
}

var user = request.agent(app);
describe('POST /login', function (done) {
  it('Retunere 401, hvis brugeren ikke kan logge ind', function (done) {
    user
      .post('/login')
      .send(WrongUserCredentials)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it('Returnere 200, hvis brugeren kan logge ind', function (done) {
    user
      .post('/login')
      .send(TrueuserCredentials)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});