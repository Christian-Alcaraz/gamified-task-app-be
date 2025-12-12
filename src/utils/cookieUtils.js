const config = require('../config/config');
const { ENVIRONMENT } = require('../constants');

const getCookieOptionsWithExpiry = (expiresAtDate) => {
  const now = new Date();
  const getMaxAge = expiresAtDate.getTime() - now.getTime();

  /**
   * ? For SameSite:None to work Secure must be True
   */
  return {
    httpOnly: true,
    sameSite: config.env === ENVIRONMENT.PRODUCTION ? 'lax' : 'none',
    secure: true, // config.env === ENVIRONMENT.PRODUCTION,
    maxAge: getMaxAge,
    path: '/',
  };
};

const getCookieOptionsToExpire = () => {
  return {
    httpOnly: true,
    sameSite: config.env === ENVIRONMENT.PRODUCTION ? 'lax' : 'none',
    secure: true,
    maxAge: 0,
    path: '/',
  };
};

module.exports = {
  getCookieOptionsWithExpiry,
  getCookieOptionsToExpire,
};
