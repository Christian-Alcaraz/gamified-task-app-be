const { User } = require('../models');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { STATUS, USER_TYPE } = require('../constants');
const { Types } = require('mongoose');

/**
 * @typedef {import('../models/user.model').User} User
 */

/**
 *
 * @param {Partial<User>} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  try {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const userId = new Types.ObjectId();
    userBody.type = USER_TYPE.USER;
    userBody._id = userId;

    return User.create(userBody);
  } catch (e) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong while creating user', false, e);
  }
};

/**
 * @param {Types.ObjectId} userId
 * @param {Partial<User>} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, userBody) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  Object.assign(user, userBody);
  await user.save();
  return user;
};

/**
 *
 * @param {Types.ObjectId} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  return User.findOne({
    _id: userId,
    type: USER_TYPE.USER,
  });
};

/**
 *
 * @param {USER_TYPE} [type]
 * @param {STATUS} [userStatus]
 * @returns
 */
const getUsers = async (userType, userStatus) => {
  const searchQuery = {
    type: userType ?? USER_TYPE.USER,
    status: userStatus ?? STATUS.ACTIVE,
  };

  const users = await User.find(searchQuery);

  return users;
};

/**
 *
 * @param {string} id
 * @param {string} service //Todo: Add enum consts
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByOAuth = async (id, service, email) => {
  return User.findOne({
    'oauth.serviceType': service,
    'oauth._oauthId': id,
    email,
  });
};

/**
 *
 * @param {Types.ObjectId} userId
 * @param {STATUS} status
 * @returns
 */
const patchUserStatusById = async (userId, status) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.status = status;
  await user.save();
  return user;
};

/**
 *
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email, status: STATUS.ACTIVE });
};

module.exports = {
  createUser,
  updateUserById,
  getUserById,
  getUserByOAuth,
  getUsers,
  patchUserStatusById,
  getUserByEmail,
};
