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
    gold: defaults.gold,
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
const putGrantUserTaskRewards = async (user, task, reward) => {
  if (!user || !task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or Task is missing');
  }

  const userStats = user.stats;
  let toNextLevel = userStats.toNextLevel;
  let updateLevel = userStats.level;
  let updateExp = userStats.experience;

  const remainingXp = GAME_CORE.getRemainingXp(userStats.level, userStats.experience + reward.experience);

  if (remainingXp <= 0) {
    updateLevel++;
    updateExp = remainingXp * -1;
    toNextLevel = GAME_CORE.getRemainingXp(updateLevel, updateExp);
  } else {
    updateExp = Math.floor(updateExp + reward.experience);
  }

  const statsBody = {
    ...user.stats,
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

  if (!task.rewardGranted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Task has not rewarded');
  }

  const userStats = user.stats;
  const reward = task.rewardGranted;

  let toNextLevel = userStats.toNextLevel;
  let updateLevel = userStats.level;
  let revokedExp = userStats.experience;

  const revokeGold = Math.max(userStats.gold - reward.gold, 0);

  revokedExp -= reward.experience;

  if (revokedExp < 0) {
    switch (updateLevel - 1) {
      case 0:
        updateLevel = 1;
        revokedExp = 0;
        toNextLevel = GAME_CORE.calculateXPToNextLevel(updateLevel);
        break;
      default:
        updateLevel -= 1;
        toNextLevel = GAME_CORE.calculateXPToNextLevel(updateLevel);
        revokedExp += toNextLevel;
        break;
    }
  }

  const statsBody = {
    ...user.stats,
    gold: revokeGold,
    experience: revokedExp,
    level: updateLevel,
    toNextLevel,
  };

  Object.assign(user, { stats: statsBody });
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
