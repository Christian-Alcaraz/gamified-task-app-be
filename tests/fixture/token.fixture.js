const { tokenService } = require('../../src/services');

const getBearerToken = (user) => {
  return `Bearer ${tokenService.generateAuthToken(user._id)}`;
};

module.exports = {
  getBearerToken,
};
