const { User } = require('../models');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { STATUS, USER_TYPE } = require('../constants');
const mongoose = require('mongoose');

/** @typedef {import('../models/user.model').Character} Character */
/** @typedef {import('../models/user.model').UserDocument} UserDocument */

/**
 *
 * @param {string} characterName
 * @returns
 */
const isCharacterNameTaken = async (characterName) => {
  const character = await User.findOne({ 'character.name': characterName });
  return !!character;
};

/**
 *
 * @param {Partial<Character>} characterBody { name, skinColor, imageUrl, class, head, face, body, accessories}
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<UserDocument>} User Document
 */
const patchCreateUserCharacterById = async (userId, characterBody) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (await isCharacterNameTaken(characterBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Character name already taken');
  }

  const { flags } = user;

  if (flags.hasCreatedCharacter) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Character already created');
  }

  flags.hasCreatedCharacter = true;
  flags.hasAcceptedTerms = true;

  Object.assign(user, { character: characterBody });

  await user.save();
  return user;
};

/**
 * @param {mongoose.Types.ObjectId} userId user id
 * @param {Partial<Character>} characterBody user new document body
 * @returns {Promise<UserDocument>} User Document
 */
const updateUserCharacterById = async (userId, characterBody) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  Object.assign(user, { character: characterBody });
  await user.save();
  return user;
};

module.exports = {
  isCharacterNameTaken,
  patchCreateUserCharacterById,
  updateUserCharacterById,
};
