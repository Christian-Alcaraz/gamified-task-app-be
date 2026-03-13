const mongoose = require('mongoose');
const { CONVERSATION_TYPES } = require('../constants');

/** @typedef {import('../types').IUserLog} IUserLog */

/**
 * @typedef {Object} ConversationMessage
 * @property {string} body
 * @property {string} messageId
 * @property {IUserLog} createdBy
 * @property {IUserLog} [receivedBy]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 * @property {string} _conversationId
 */

/**
 * @typedef {Object} Conversation
 * @property {string} _id
 * @property {string} name
 * @property {string} type
 * @property {ConversationMessage[]} [messages]
 * @property {ConversationMessage} [lastMessage]
 * @property {(IUserLog & { role?: string })[]} [participants]
 * @property {IUserLog} [updatedBy]
 * @property {IUserLog} [createdBy]
 * @property {boolean} isGroupChat
 */

/** @typedef {mongoose.Document & Conversation} ConversationDocument */

const USER_LOG_PROPS = new mongoose.Schema(
  {
    name: {
      type: String,
      ref: 'User',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { _id: false },
);

const MESSAGE_PROPS = {
  body: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
    ref: 'Message',
  },
  createdBy: USER_LOG_PROPS,
  receivedBy: USER_LOG_PROPS,
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
  },
  _conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
};

/** @type {mongoose.Schema<ConversationDocument>} */
const conversationSchema = new mongoose.Schema(
  {
    lastMessage: mongoose.Schema.Types.Mixed,
    messages: {
      type: [MESSAGE_PROPS],
      default: [],
    },
    type: {
      type: String,
      enum: CONVERSATION_TYPES,
      required: true,
    },
    name: {
      type: String,
    },
    isGroupChat: {
      //Todo: there is already party model, if party.id exists, chat room is group chat
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
    },
    participants: {
      type: [USER_LOG_PROPS],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<ConversationDocument>} */
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
