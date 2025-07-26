const sex = require('./sex.constant');
const status = require('./status.constant');
const tokenType = require('./tokenType.constant');
const userType = require('./userType.constant');

module.exports = {
  ...sex,
  ...status,
  ...tokenType,
  ...userType,
};
