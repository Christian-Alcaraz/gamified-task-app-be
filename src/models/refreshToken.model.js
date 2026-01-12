const mongoose = require('mongoose');

/**
 * @typedef {Object} RefreshToken
 * @property {mongoose.Types.ObjectId} [_id]
 * @property {Object} token
 * @property {Date} expiresAt
 * @property {mongoose.Types.ObjectId} _userId
 * @property {Date} [revokedAt]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/** @typedef {mongoose.Document & RefreshToken} RefreshTokenDocument */

/** @type {mongoose.Schema<RefreshToken>} */
const refreshTokenSchema = new mongoose.Schema(
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
