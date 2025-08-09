const httpStatus = require('http-status').status;
const { authService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);

  res.status(httpStatus.CREATED).send({ ...user.toJSON() });
});

const loginUserWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  res.status(httpStatus.OK).send({ ...user.toJSON() });
});

module.exports = { registerUser, loginUserWithEmailAndPassword };
