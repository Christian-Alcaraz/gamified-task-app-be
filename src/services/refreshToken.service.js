const moment = require('moment');
const { RefreshToken } = require('../models');
const config = require('../config/config');
const cryptoUtils = require('../utils/cryptoUtils');

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
 * @description Revokes the latest refresh token by user id
 * @param {MongoID} userId
 * @returns boolean
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
 *
 * @param {MongoIdOrString} refreshTokenId
 * @returns boolean
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

const getLatestRefreshTokenByUserId = async (userId) => {
  const refreshToken = await RefreshToken.find({ _userId: userId }).sort({ createdAt: -1 }).limit(1);
  return refreshToken[0];
};

const getRefreshTokenWithUserId = async (token, userId) => {
  const refreshToken = await RefreshToken.findOne({ token, _userId: userId });
  return refreshToken;
};

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
