const { User } = require('../models');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../constants');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const userId = new mongoose.Types.ObjectId();
  userBody.userType = USER_TYPE.USER;
  userBody._id = userId;

  return User.create(userBody);
};

const updateUserById = async (userId, userBody) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const getUserById = async (userId) => {
  return User.findOne({
    _id: userId,
    userType: USER_TYPE.USER,
  });
};

const getUserByOAuth = async (id, service, email) => {
  return User.findOne({
    'oauth.serviceType': service,
    'oauth._oauthId': id,
    email,
  });
};

const patchUserStatusById = async (userId, status) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.status = status;
  await user.save();
  return user;
};

const getUserByEmail = async (email) => {
  return User.findOne({ email, status: STATUS.ACTIVE });
};

module.exports = {
  createUser,
  updateUserById,
  getUserById,
  getUserByOAuth,
  patchUserStatusById,
  getUserByEmail,
};
