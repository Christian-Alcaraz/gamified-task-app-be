const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status').status;
const { User } = require('../models');
const { STATUS, TOKEN_TYPE } = require('../constants');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const verifyToken = (token, secret = config.jwt.secret) => {
  return jwt.verify(token, secret);
};

const verifyResetPasswordToken = async (token) => {
  let payload;
  try {
    payload = verifyToken(token, config.jwt.resetPasswordSecret);
    if (payload.type !== TOKEN_TYPE.CHANGE_PASSWORD) {
      throw new Error();
    }
  } catch (e) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Reset password link expired, please try again.');
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Reset Password failed, please try again.');
  }

  if (user.status === STATUS.DELETED) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Your account has been deleted, please contact support');
  }

  if (user.status === STATUS.INACTIVE) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Your account is inactive, please contact support');
  }

  return user;
};

const generateToken = (userId, expires, tokenType) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type: tokenType,
  };

  return jwt.sign(payload, config.jwt.secret);
};

const generateAuthToken = (userId) => {
  const accessTokenExpires = moment().add(config.jwt.authTokenExpirationDays, 'days');
  const token = generateToken(userId, accessTokenExpires, TOKEN_TYPE.ACCESS);

  return token;
};

const generateResetPasswordToken = (userId) => {
  const expires = moment().add(config.jwt.resetPasswordExpirationMins, 'minutes');
  return generateToken(userId, expires, TOKEN_TYPE.CHANGE_PASSWORD);
};

module.exports = {
  verifyToken,
  verifyResetPasswordToken,
  generateAuthToken,
  generateResetPasswordToken,
};
