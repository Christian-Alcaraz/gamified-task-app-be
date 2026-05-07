const mongoose = require('mongoose');

/** @typedef {import('../types').IUserLog} IUserLog */

/**
 * @typedef {Object} Message
 * @property {string | mongoose.Types.ObjectId} _id
 * @property {string} body
 * @property {boolean} read
 * @property {IUserLog} receivedBy
 * @property {IUserLog} [updatedBy]
 * @property {IUserLog} [createdBy]
 * @property {string} [createdAt]
 * @property {string | mongoose.Types.ObjectId} conversationId
 */

/** @typedef {mongoose.Document & Message} MessageDocument */

/** @type {mongoose.Schema<MessageDocument>} */
const messageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    receivedBy: {
      name: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    createdBy: {
      name: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<MessageDocument>} */
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
