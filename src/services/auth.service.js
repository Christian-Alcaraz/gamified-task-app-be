const userService = require('./user.service');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { USER_TYPE } = require('../constants');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  return user;
};

const registerUser = async (email, password) => {
  const isUserEmailTaken = await userService.getUserByEmail(email);
  if (isUserEmailTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const newUser = await userService.createUser({ email, password });
  return newUser;
};

//Todo: Reset User Password via creating reset password token that will be sent to user email; meaning you need email smtp server

module.exports = {
  loginUserWithEmailAndPassword,
  registerUser,
};
