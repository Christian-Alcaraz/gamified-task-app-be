const httpStatus = require('http-status').status;
const { authService, tokenService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);
  const token = tokenService.generateAuthToken(user._id);

  res.status(httpStatus.CREATED).send({ ...user.toJSON(), token });
});

const loginUserWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = tokenService.generateAuthToken(user._id);

  res.status(httpStatus.OK).send({ ...user.toJSON(), token });
});

module.exports = { registerUser, loginUserWithEmailAndPassword };
