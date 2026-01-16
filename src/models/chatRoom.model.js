const mongoose = require('mongoose');

/** @typedef {import('../types').IUserLog} IUserLog */

/**
 * @typedef {Object} ChatRoomMessage
 * @property {string} body
 * @property {string} messageId
 * @property {IUserLog} sender
 * @property {IUserLog} [receiver]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 * @property {string | mongoose.Types.ObjectId} _chatId
 */

/**
 * @typedef {Object} ChatRoom
 * @property {string | mongoose.Types.ObjectId} _id
 * @property {ChatRoomMessage[]} [messages]
 * @property {ChatRoomMessage} [lastMessage]
 * @property {string[]} [participants]
 * @property {IUserLog} [updatedBy]
 * @property {IUserLog} [createdBy]
 * @property {boolean} isGroupChat
 * @property {string | mongoose.Types.ObjectId} _chatId
 */

/** @typedef {mongoose.Document & ChatRoom} ChatRoomDocument */

const USER_LOG_PROPS = {
  name: {
    type: String,
    ref: 'User',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
};

const CHAT_ROOM_MESSAGE_PROPS = {
  body: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
    ref: 'Message',
  },
  sender: USER_LOG_PROPS,
  receiver: USER_LOG_PROPS,
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
  },
  _chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
};

/** @type {mongoose.Schema<ChatRoomDocument>} */
const chatRoomSchema = new mongoose.Schema(
  {
    lastMessage: CHAT_ROOM_MESSAGE_PROPS,
    messages: {
      type: [CHAT_ROOM_MESSAGE_PROPS],
      default: [],
    },
    isGroupChat: {
      type: Boolean,
      default: true,
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
    participants: {
      type: [
        {
          name: {
            type: String,
          },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<ChatRoomDocument>} */
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
