const sex = require('./sex.constant');
const status = require('./status.constant');
const tokenType = require('./tokenType.constant');
const userType = require('./userType.constant');
const taskConstants = require('./task.constant');
const CHARACTER = require('./character.constant');

module.exports = {
  ...sex,
  ...status,
  ...tokenType,
  ...userType,
  ...taskConstants,
  CHARACTER,
};
