const mongoose = require('mongoose');
const { STATUSES, STATUS } = require('../constants');

/** @typedef {import('../types').IUserLog} IUserLog */

/**
 * @typedef {IUserLog & {role?: string}} PartyMember
 */

/**
 * @typedef {Object} Party
 * @property {mongoose.Types.ObjectId} [_id]
 * @property {string} name
 * @property {string} [code]
 * @property {string} description
 * @property {string} [imageUrl]
 * @property {PartyMember} leader
 * @property {Array<PartyMember>} members
 * @property {boolean} isPublic
 * @property {string} status
 * @property {IUserLog} [updatedBy]
 * @property {IUserLog} [createdBy]
 */

/** @typedef {mongoose.Document & Party} PartyDocument */

/** @type {mongoose.Schema<PartyDocument>} */
const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      maxLength: 8,
      minLength: 8,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      trim: true,
      // required: true,
    },
    leader: {
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    members: [
      {
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    isPublic: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: STATUS.ACTIVE,
    },
    updatedBy: {
      name: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    createdBy: {
      name: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<PartyDocument>} */
const Party = mongoose.model('Party', partySchema);

module.exports = Party;
