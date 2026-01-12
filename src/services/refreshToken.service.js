const moment = require('moment');
const { RefreshToken } = require('../models');
const config = require('../config/config');
const cryptoUtils = require('../utils/cryptoUtils');

/** @typedef {import('../models/refreshToken.model').RefreshToken} RefreshToken */
/** @typedef {import('../models/refreshToken.model').RefreshTokenDocument} RefreshTokenDocument */

/**
 * Creates a refresh token for a user
 * @param {string} userId
 * @returns {Promise<RefreshTokenDocument>}
 */
const createRefreshTokenByUserId = async (userId) => {
  const refreshTokenExpires = moment().add(config.jwt.refreshTokenExpirationDays, 'days');

  const text = `${userId}:${refreshTokenExpires}`;
  const token = cryptoUtils.createHash(text);

  const refreshToken = await RefreshToken.create({
    token,
    _userId: userId,
    expiresAt: refreshTokenExpires,
  });

  return refreshToken;
};

/**
 * Revokes the latest refresh token by user id
 * @param {string} userId
 * @returns {Promise<boolean>}
 */

const revokeLatestRefreshTokenByUserId = async (userId) => {
  let hasUpdate = true;
  const refreshToken = await getLatestRefreshTokenByUserId(userId);

  if (!refreshToken || refreshToken?.revokedAt) {
    hasUpdate = false;
  } else {
    refreshToken.revokedAt = new Date();
    await refreshToken.save();
  }

  return hasUpdate;
};

/**
 * Revokes refresh token by id
 * @param {string} refreshTokenId
 * @returns {Promise<boolean>}
 */
const revokeRefreshTokenById = async (refreshTokenId) => {
  let hasUpdate = true;
  const refreshToken = await RefreshToken.findById(refreshTokenId);

  if (!refreshToken || refreshToken?.revokedAt) {
    hasUpdate = false;
  } else {
    refreshToken.revokedAt = new Date();
    await refreshToken.save();
  }

  return hasUpdate;
};

/**
 * Get latest refresh token by user id
 * @param {string} userId
 * @returns {Promise<RefreshTokenDocument>}
 */
const getLatestRefreshTokenByUserId = async (userId) => {
  const refreshToken = await RefreshToken.find({ _userId: userId }).sort({ createdAt: -1 }).limit(1);
  return refreshToken[0];
};

/**
 * Get refresh token with user id
 * @param {string} token
 * @param {string} userId
 * @returns {Promise<RefreshTokenDocument>}
 */
const getRefreshTokenWithUserId = async (token, userId) => {
  const refreshToken = await RefreshToken.findOne({ token, _userId: userId });
  return refreshToken;
};

/**
 * Get refresh token by token string
 * @param {string} token
 * @returns {Promise<RefreshTokenDocument>}
 */
const getRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token });
  return refreshToken;
};

module.exports = {
  createRefreshTokenByUserId,
  revokeLatestRefreshTokenByUserId,
  revokeRefreshTokenById,
  getRefreshToken,
  getLatestRefreshTokenByUserId,
  getRefreshTokenWithUserId,
};
