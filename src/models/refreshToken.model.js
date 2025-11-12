const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const toJSON = require('./plugins/toJSON');
const { USER_TYPE, USER_TYPES, STATUSES, STATUS, OAUTH_TYPE, OAUTH_TYPES, SEXES } = require('../constants');
const { ref } = require('joi');

/**
 * @typedef {Object} RefreshToken
 * @property {Object} token
 * @property {Date} expiresAt
 * @property {mongoose.Types.ObjectId} _userId
 */

/** @typedef {mongoose.Document<mongoose.Types.ObjectId, {}, RefreshToken> & RefreshToken} RefreshTokenDocument */

/** @type {mongoose.Schema<RefreshToken>} */
const refreshTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
    },
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    revokedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<RefreshToken>} */
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;
