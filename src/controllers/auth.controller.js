const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { authService, tokenService, userService } = require('../services');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);
  const token = tokenService.generateAuthToken(user._id);

  res.status(httpStatus.CREATED).send({ ...user.toJSON(), token });
});

// Todo: Create cache db for logged in users for activity?

const loginUserWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = tokenService.generateAuthToken(user._id);

  const refreshToken = res.cookie('X-Refresh-Token', refreshToken.token);

  res.status(httpStatus.OK).send({ ...user.toJSON(), token });
});

const refreshUserToken = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const refreshToken = await tokenService.getRefreshTokenByUserId(userId);
  const token = tokenService.generateAuthToken(userId);

  res.status(httpStatus.OK).send({ token });
});

const logoutUser = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await authService.logoutUser(userId);
  res.status(httpStatus.OK).send();
});

const me = catchAsync(async (req, res) => {
  console.log('Request Cookies', JSON.stringify(req.cookies, null, 2));

  const userId = req.user._id;
  const user = await User.findById(userId);

  res.status(httpStatus.OK).send(user.toJSON());
});

module.exports = { registerUser, loginUserWithEmailAndPassword, me, logoutUser };
