const mongoose = require('mongoose');
const { STATUSES, STATUS } = require('../constants');
/**
 * @typedef {Object} Party
 * @property {string} name
 * @property {string} code
 * @property {string} description
 * @property {string} imageUrl
 * @property {User} leader
 * @property {Array<User>} members
 * @property {boolean} public
 * @property {string} status
 */

/** @typedef {mongoose.Document<mongoose.Types.ObjectId, {}, Party> & Party} PartyDocument */

const partySchema = mongoose.Schema(
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
      id: {
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
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    public: {
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
  },
  {
    timestamps: true,
  },
);

const Party = mongoose.model('Party', partySchema);

module.exports = Party;
