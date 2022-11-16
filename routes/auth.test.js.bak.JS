const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /join', () => {
  test('Join if not logged in', done => {
    request(app)
      .post('/auth/join')
      .send({
        email: 'zeroch0@gmail.com',
        nick: 'zerocho',
        password: 'nodejsbook'
      })
      .expect('Location', '/')
      .expect(302, done);
  });
});

describe('POST /join', () => {
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'zeroch0@gmail.com',
        password: 'nodejsbook',
      })
      .end(done);
  });

  test('이미 로그인 했으면 redirect "/"', (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post('/auth/login')
      .send({
        email: 'zeroch0@gmail.com',
        password: 'nodejsbook'
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });
});

describe('POST /login', () => {

  test('가입되지 않은 회원', (done) => {
    const message = encodeURIComponent('Cannot find user');
    request(app)
      .post('/auth/login')
      .send({
        email: 'onech0@gmail.com',
        password: 'nodejsbook'
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });

  test('로그인 수행', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'zeroch0@gmail.com',
        password: 'nodejsbook'
      })
      .expect('Location', '/')
      .expect(302, done);
  });

  test('비밀번호 틀림', done => {
    const message = encodeURIComponent('Password is incorrect');
    request(app)
      .post('/auth/login')
      .send({
        email: 'zeroch0@gmail.com',
        password: 'wrongpassword'
      })
      .expect('Location', `/?loginError=${message}`)
      .expect(302, done);
  });

});

describe('GET /logout', () => {
  test('return 403 if not logged in', (done) => {
    request(app)
      .get('/auth/logout')
      .expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach(done => {
    agent
      .post('/auth/login')
      .send({
        email: 'zeroch0@gmail.com',
        password: 'nodejsbook',
      })
      .end(done);
  });

  test('로그아웃 수행', (done) => {
    agent
      .get('/auth/logout')
      .expect('Location', '/')
      .expect(302, done);
  });

});

afterAll(async () => {
  await sequelize.sync({ force: true });
});