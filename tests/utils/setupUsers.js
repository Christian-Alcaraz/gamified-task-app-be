const { insertUsers, testAdmin } = require('../fixture/user.fixture');

const setupUsers = () => {
  beforeEach(async () => {
    return Promise.all([insertUsers([testAdmin])]);
  });
};

module.exports = setupUsers;
