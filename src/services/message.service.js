const mongoose = require('mongoose');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { Message } = require('../models');
const userService = require('./user.service');

/** @typedef {import('../models/message.model').MessageDocument} MessageDocument */
/** @typedef {import('../models/message.model').Message} Message */
/** @typedef {import('../types').IQueryFilter} IQueryFilter */

/**
 * Create Message
 * Get Message by Message Id
 * Get messages by User Id
 * Read Message by Message Id and User Id
 * Update Message by message id and user id
 */

/**
 * Create Message
 * @param {Partial<Message>} messageBody
 * @param {string} senderId
 * @param {string} receiverId
 * @param {string} conversationId
 * @returns {Promise<MessageDocument>}
 */
const createMessage = async (messageBody, senderId, receiverId, conversationId) => {
  const sender = await userService.getUserById(senderId);
  const receiver = await userService.getUserById(receiverId);

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sender/Receiver not Found');
  }

  const senderUserLog = {
    name: sender.name ?? sender?.character?.name,
    userId: sender._id,
  };

  const receiverUserLog = {
    name: receiver.name ?? receiver?.character?.name,
    userId: receiver._id,
  };

  /** @type {Partial<MessageDocument>} */
  const body = {
    ...messageBody,
    read: false,
    createdBy: senderUserLog,
    receivedBy: receiverUserLog,
    conversationId: conversationId,
  };

  const message = await Message.create(body);
  return message;
};

/**
 * Get Message by Message.Id
 * @param {string} messageId
 * @returns {Promise<MessageDocument>}
 */
const getMessageById = async (messageId) => {
  return await Message.findOne({ _id: messageId });
};

/**
 * Get Messages by User.Id
 * @param {string} userId
 * @returns {Promise<MessageDocument[]>}
 */
const getMessagesByUserId = async (userId) => {
  return await Message.find({ receivedBy: { userId } });
};

/**
 * Get Messages by ChatRoom.Id w/o User.Id
 * @param {string} conversationId
 * @param {string} [userId]
 * @returns {Promise<MessageDocument[]>}
 */
const getMessagesByChatId = async (conversationId, userId) => {
  const query = {};
  query['conversationId'] = conversationId;

  if (userId) {
    query['$or'] = [
      {
        receivedBy: {
          userId,
        },
        createdBy: {
          userId,
        },
      },
    ];
  }

  return await Message.find(query);
};

/**
 * Get Unread
 * @param {string} userId
 * @param {IQueryFilter} query
 * @returns {Promise<MessageDocument[]>}
 */
const getUnreadMessagesByUserId = async (userId, query) => {
  const { pageIndex, pageSize, sort, conversationId } = query;

  let filter = {};
  filter['read'] = false;
  filter['receivedBy.userId'] = userId;

  if (conversationId) {
    filter['conversationId'] = conversationId;
  }

  /** @type {Record<string, number>} */
  const sortBy = {};

  if (sort) {
    const [path, direction] = sort.split(':');
    sortBy[path] = direction === 'desc' ? -1 : 1;
  } else {
    sortBy.createdAt = -1;
  }

  const messages = await Message.find(filter)
    .skip(pageIndex * pageSize)
    .limit(pageSize || 9999)
    .sort(sortBy);

  return messages;
};

/**
 * Updates Message.Read by Message.Id and User.Id
 * @param {string} messageId
 * @param {string} userId
 * @returns {Promise<MessageDocument>}
 */
const readMessage = async (messageId, userId) => {
  const message = await Message.findOne({ _id: messageId });
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  if (message.read) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Message already read');
  }

  message.read = true;

  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.character) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User character not found');
  }

  message.updatedBy = {
    name: user.character.name,
    userId: user._id,
  };

  await message.save();
  return message;
};

/**
 * Update message body
 * @param {string} messageId
 * @param {string} userId
 * @param {Partial<Message>} messageBody
 * @returns {Promise<MessageDocument>}
 */
const updateMessageByIdAndUserId = async (messageId, userId, messageBody) => {
  const message = await Message.findOne({ _id: messageId, createdBy: { userId } });
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.character) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User character not found');
  }

  message.updatedBy = {
    name: user?.character?.name,
    userId: user._id,
  };

  message.body = messageBody;

  await message.save();
  return message;
};

module.exports = {
  createMessage,
  readMessage,
  getMessageById,
  getMessagesByUserId,
  getMessagesByChatId,
  getUnreadMessagesByUserId,
  updateMessageByIdAndUserId,
};
