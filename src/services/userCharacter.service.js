const mongoose = require('mongoose');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { User, Config } = require('../models');
const { CONFIG } = require('../constants');
const GAME_CORE = require('../utils/gameCore');

/** @typedef {import('../models/user.model').Character} UserCharacter */
/** @typedef {import('../models/user.model').UserDocument} UserDocument */
/** @typedef {import('../models/task.model').TaskDocument} TaskDocument */

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
 * @param {Partial<UserCharacter>} characterBody { name, skinColor, imageUrl, class, head, face, body, accessories}
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<UserDocument>} User Document
 */
const patchCreateUserCharacterById = async (userId, characterBody) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { flags } = user;

  if (flags.hasCreatedCharacter) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Character already created');
  }

  if (await isCharacterNameTaken(characterBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Character name already taken');
  }

  flags.hasCreatedCharacter = true;
  flags.hasAcceptedTerms = true;

  const config = await Config.findOne({ name: CONFIG.CLASS_DEFAULTS });
  const defaults = config.data;
  const classStats = defaults.class[characterBody.class];

  const stats = {
    ...classStats,
    experience: defaults.experience,
    level: defaults.level,
    statPoints: defaults.statPoints,
    toNextLevel: defaults.toNextLevel,
  };

  Object.assign(user, { character: characterBody, stats });

  await user.save();
  return user;
};

/**
 * @param {mongoose.Types.ObjectId} userId user id
 * @param {Partial<UserCharacter>} characterBody user new document body
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

/**
 *
 * @param {UserDocument} user
 * @param {TaskDocument} task
 * @returns {Promise<UserDocument>}
 */
const putGrantUserTaskRewards = async (user, task) => {
  if (!user || !task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or Task is missing');
  }

  const userStats = user.stats;
  let toNextLevel;
  let updateLevel = userStats.level;
  let updateExp = userStats.experience;

  const reward = GAME_CORE.calculateTaskReward(userStats.level, task);
  const remainingXp = GAME_CORE.getRemainingXPForNextLevel(userStats.level, userStats.experience + reward.experience);

  if (remainingXp <= 0) {
    updateLevel++;
    updateExp = remainingXp * -1;
    toNextLevel = GAME_CORE.getRemainingXPForNextLevel(updateLevel, updateExp);
  } else {
    toNextLevel = remainingXp;
    updateExp = Math.floor(updateExp + reward.experience);
  }

  const statsBody = {
    gold: userStats.gold + reward.gold,
    experience: updateExp,
    level: updateLevel,
    toNextLevel,
  };

  Object.assign(user, { stats: statsBody });
  await user.save();
  return user;
};

/**
 *
 * @param {UserDocument} user
 * @param {TaskDocument} task
 * @returns {Promise<UserDocument>}
 */
const putRevokeUserTaskRewards = async (user, task) => {
  if (!user || !task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or Task is missing');
  }

  const userStats = user.stats;
  let toNextLevel;
  let updateLevel = userStats.level;
  let updateExp = userStats.experience;

  const reward = GAME_CORE.calculateTaskReward(userStats.level, task);
  const calculatedGold = userStats.gold - reward.gold <= 0 ? 0 : userStats.gold - reward.gold;

  updateExp -= reward.experience;

  // negative updateExp
  if (updateExp < 0) {
    switch (updateLevel - 1) {
      case 0:
        updateLevel = 1;
        updateExp = 0;
        toNextLevel = GAME_CORE.calculateXPToNextLevel(updateLevel);
        break;
      default:
        updateLevel -= 1;
        toNextLevel = GAME_CORE.calculateXPToNextLevel(updateLevel);
        updateExp += toNextLevel;
        toNextLevel = GAME_CORE.getRemainingXPForNextLevel(updateLevel, updateExp);
        break;
    }
  } else {
    toNextLevel = GAME_CORE.getRemainingXPForNextLevel(updateLevel, updateExp);
  }

  const statsBody = {
    gold: calculatedGold,
    experience: updateExp,
    level: updateLevel,
    toNextLevel,
  };

  Object.assign(user.stats, statsBody);
  await user.save();
  return user;
};

const updateUserStatsById = async (userId, statsBody) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  Object.assign(user, { stats: statsBody });
  await user.save();
  return user;
};

module.exports = {
  isCharacterNameTaken,
  patchCreateUserCharacterById,
  updateUserCharacterById,
  updateUserStatsById,
  putGrantUserTaskRewards,
  putRevokeUserTaskRewards,
};
