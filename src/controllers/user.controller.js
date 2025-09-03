const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res, next) => {
  const userBody = req.body;
  const user = await userService.createUser(userBody);
  res.status(httpStatus.CREATED).send(user);
});

const updateUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const userBody = req.body;
  const user = await userService.updateUserById(userId, userBody);
  res.status(httpStatus.OK).send(user);
});

const patchUserStatusById = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const status = req.query.status;
  const user = await userService.patchUserStatusById(userId, status);
  res.status(httpStatus.OK).send(user);
});

const getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await userService.getUserById(userId);
  res.status(httpStatus.OK).send(user);
});

const getUsers = catchAsync(async (req, res, next) => {
  const userType = req.query.type ?? null;
  const userStatus = req.query.status ?? null;
  const users = await userService.getUsers(userType, userStatus);
  res.status(httpStatus.OK).send(users);
});

const getUserByOAuth = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const service = req.query.service;
  const email = req.query.email;
  const user = await userService.getUserByOAuth(userId, service, email);
  res.status(httpStatus.OK).send(user);
});

const getUserByEmail = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  const user = await userService.getUserByEmail(email);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  createUser,
  updateUserById,
  patchUserStatusById,
  getUsers,
  getUserById,
  getUserByOAuth,
  getUserByEmail,
};
