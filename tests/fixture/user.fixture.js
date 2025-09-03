const { USER_TYPE, STATUS } = require('../../src/constants');
const { User } = require('../../src/models');
const bcrypt = require('bcryptjs');

const testAdmin = {
  _id: '5f0b9b2b4f2c7b1b8f5b3d6f',
  email: 'test@gmail.com',
  password: 'Password123!',
  type: USER_TYPE.ADMIN,
  status: STATUS.ACTIVE,
};

const testUser = {
  _id: '676e95c9087e0ff23d63a412',
  email: 'test1@gmail.com',
  password: 'Password123!',
  type: USER_TYPE.USER,
  status: STATUS.ACTIVE,
};

const testUserDeleted = {
  _id: '676e95c9087e0ff23d63a411',
  email: 'test2@gmail.com',
  password: 'Password123!',
  type: USER_TYPE.USER,
  status: STATUS.DELETED,
};

const testOauthUser = {
  _id: '676e95c9057e0ff23d63a412',
  email: 'test3@gmail.com',
  password: 'Password123!',
  type: USER_TYPE.USER,
  status: STATUS.ACTIVE,
  oauth: {
    serviceType: 'google',
    _oauthId: '123456789',
  },
};

const testOauthUserFalse = {
  _id: '676e95c9087e0ff23d63a212',
  email: 'test4@gmail.com',
  password: 'Password123!',
  type: USER_TYPE.USER,
  status: STATUS.ACTIVE,
  oauth: {},
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password) })));
};

module.exports = {
  testAdmin,
  testUser,
  testUserDeleted,
  testOauthUser,
  testOauthUserFalse,
  insertUsers,
};
