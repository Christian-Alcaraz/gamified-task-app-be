const request = require('supertest');
const httpStatus = require('http-status').status;
const app = require('../../src/app');
const { User } = require('../../src/models');
const setupTestDB = require('../utils/setupTestDB');
const { TOKEN_TYPE } = require('../../src/constants');
const { testAdmin, insertUsers, testUser } = require('../fixture/user.fixture');
const { getBearerToken } = require('../fixture/token.fixture');
const { tokenService } = require('../../src/services');

// Setup the test database
setupTestDB();

describe('[Routes] Auth = /api/auth', () => {
  describe('POST /login', () => {
    it('should return 200 and login admin', async () => {
      await insertUsers([testAdmin]);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testAdmin.email, password: testAdmin.password });

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toMatchObject({
        _id: testAdmin._id,
        email: testAdmin.email,
        type: testAdmin.type,
        status: testAdmin.status,
      });

      const decodedToken = tokenService.verifyToken(res.body.token);
      expect(decodedToken).toMatchObject({
        sub: testAdmin._id,
        type: TOKEN_TYPE.ACCESS,
      });
    });

    it('should return 200 and login user', async () => {
      await insertUsers([testUser]);

      const res = await request(app).post('/api/v1/auth/login').send({ email: testUser.email, password: testUser.password });
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(expect.objectContaining({ token: expect.any(String) }));
    });

    it('should return 401 if email does not exist', async () => {
      await insertUsers([testUser]);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'testfailure1010@gmail.com', password: testUser.password });
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return 401 if password is wrong', async () => {
      await insertUsers([testUser]);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'wrongPassword123' });
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return 400 if email is not provided', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({ password: testUser.password });
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /register', () => {
    it('should return 201 and register user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body).toMatchObject({
        _id: expect.any(String),
        email: testUser.email,
        type: testUser.type,
        status: testUser.status,
      });

      const userDb = await User.findById(res.body._id);
      expect(userDb).toEqual(expect.objectContaining({ email: testUser.email }));

      const decodedToken = tokenService.verifyToken(res.body.token);
      expect(decodedToken).toMatchObject({
        sub: res.body._id,
        type: TOKEN_TYPE.ACCESS,
      });
    });

    it('should return 400 if email is already taken', async () => {
      await insertUsers([testUser]);
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return 400 if email is not provided', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({ password: testUser.password });
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return 400 if password is not provided', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({ email: testUser.email });
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /me', () => {
    let bearerToken;
    beforeEach(async () => {
      await insertUsers([testUser]);
      bearerToken = getBearerToken(testUser);
    });

    it('should return 200 and user', async () => {
      const res = await request(app).get('/api/v1/auth/me').set('Authorization', bearerToken);
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toMatchObject({
        _id: testUser._id,
        email: testUser.email,
        type: testUser.type,
        status: testUser.status,
      });
    });

    it('should return 401 if not logged in', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
