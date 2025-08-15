const { User } = require('../models');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { STATUS, USER_TYPE } = require('../constants');
const mongoose = require('mongoose');

/** @typedef {import('../models/user.model').User} User */
/** @typedef {import('../models/user.model').UserDocument} UserDocument */

/**
 *
 * @param {Partial<User>} userBody user document body
 * @returns {Promise<UserDocument>}
 */
const createUser = async (userBody) => {
  try {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const userId = new mongoose.Types.ObjectId();
    userBody.type = USER_TYPE.USER;
    userBody._id = userId;

    return User.create(userBody);
  } catch (e) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong while creating user', false, e);
  }
};

/**
 * @param {mongoose.Types.ObjectId} userId user id
 * @param {Partial<User>} userBody user new document body
 * @returns {Promise<UserDocument>}
 */
const updateUserById = async (userId, userBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  Object.assign(user, userBody);
  await user.save();
  return user;
};

/**
 *
 * @param {mongoose.Types.ObjectId} userId user document id
 * @returns {Promise<UserDocument>}
 */
const getUserById = async (userId) => {
  return User.findOne({
    _id: userId,
    type: USER_TYPE.USER,
  });
};

/**
 *
 * @param {USER_TYPE} [userType] user type
 * @param {STATUS} [userStatus] user status
 * @returns {Promise<UserDocument[]>}
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
 * @param {string} oauthId oauth id
 * @param {string} oauthService oauth service type //Todo: Add enum consts
 * @param {string} email
 * @returns {Promise<UserDocument>}
 */
const getUserByOAuth = async (oauthId, oauthService, email) => {
  return User.findOne({
    'oauth.serviceType': oauthService,
    'oauth._oauthId': oauthId,
    email,
  });
};

/**
 *
 * @param {mongoose.Types.ObjectId} userId user document id
 * @param {STATUS} userStatus user status to update
 * @returns {Promise<UserDocument>}
 */
const patchUserStatusById = async (userId, userStatus) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.status = userStatus;
  await user.save();
  return user;
};

/**
 *
 * @param {string} email
 * @returns {Promise<UserDocument>}
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
