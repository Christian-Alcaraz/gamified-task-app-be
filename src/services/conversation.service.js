const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { Message, Conversation } = require('../models');
const userService = require('./user.service');
const { CONVERSATION_TYPE } = require('../constants');

/** @typedef {import('../models/conversation.model').ConversationDocument} ConversationDocument */
/** @typedef {import('../models/conversation.model').ConversationMessage} ConversationMessage */
/** @typedef {import('../models/user.model').UserDocument} UserDocument */
/** @typedef {import('../types').IUserLog} IUserLog */
/** @typedef {import('../types').IQueryFilter} IQueryFilter */

/**
 * Todo: Add Roles for Chat Room permissions (edit, rename, add participants, remove participants);
 */

/**
 * Creates Conversation
 * @param {string} creatorId
 * @param {string} participantsId
 * @param {string} [conversationName]
 * @param {string} [conversationType]
 * @returns {Promise<ConversationDocument>}
 */
const createConversation = async (
  creatorId,
  participantsId,
  conversationType = CONVERSATION_TYPE.PRIVATE,
  conversationName = '',
) => {
  const creator = await userService.getUserById(creatorId);
  if (!creator) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found');
  }

  const participants = participantsId.split(',');
  const participantsIsNotEmpty = participants.length > 0 && !!participants[0];

  if (!participantsIsNotEmpty) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Participants not found');
  }

  const retrievedParticipantsFromDB = await Promise.all(
    participants.map(async (/** @type {string} */ u) => await userService.getUserById(u)),
  );

  if (retrievedParticipantsFromDB.some((/** @type {UserDocument} */ u) => !u)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found');
  }

  const CONVERSATION_NAME =
    conversationName ?? retrievedParticipantsFromDB.map((/** @type {UserDocument} */ u) => u.character.name).join(', ');

  const chatRoom = await Conversation.create({
    participants: retrievedParticipantsFromDB.map((/** @type {UserDocument} */ u) => ({
      name: u.character.name,
      userId: u._id,
    })),
    type: conversationType,
    createdBy: {
      name: creator.character.name,
      userId: creator._id,
    },
    name: CONVERSATION_NAME,
    isGroupChat: false, //Todo: have option for creating Group Chat Room in createChatRoom()
  });

  return chatRoom;
};

/**
 * Get Conversation by its ID
 * @param {string} conversationId
 * @returns {Promise<ConversationDocument>}
 */
const getConversationById = async (conversationId) => {
  return await Conversation.findOne({ _id: conversationId });
};

/**
 * Add Participant/s to Conversation
 * @param {string} conversationId
 * @param {string} participantsId
 */
const addParticipantsToConversation = async (conversationId, participantsId) => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const participantsSplit = participantsId.split(',');
  const participantsHasAtleastOneValue = participantsSplit.length > 0 && !!participantsSplit[0];
  if (!participantsHasAtleastOneValue) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Participants not found');
  }

  const participantsUpdate = conversation.participants.map((p) => p);

  participantsSplit.forEach(async (pId) => {
    const exists = conversation.participants.some((/** @type {IUserLog} */ p) => p.userId.toString() === pId);
    if (exists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Participant already exists');
    }

    const user = await userService.getUserById(pId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    participantsUpdate.push({
      name: user.character.name,
      userId: user._id,
      role: 'Member', //Todo: chatRoom Roles enum
    });
  }); //end foreach

  const updated = await Conversation.findOneAndUpdate(
    { _id: conversation._id },
    { $set: { participants: participantsUpdate } },
    { new: true },
  );
  return updated;
};

/**
 *
 * @param {string} conversationId
 * @param {string} participantsId
 * @returns
 */
const removeParticipantFromConversation = async (conversationId, participantsId) => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const blacklist = participantsId.split(',');
  const blacklistHasAtleastOneValue = blacklist.length > 0 && !!blacklist[0];
  if (!blacklistHasAtleastOneValue) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Participants not found');
  }

  const participantsUpdate = conversation.participants.filter(
    (/** @type {IUserLog} */ p) => !blacklist.includes(p.userId.toString()),
  );

  const updated = await Conversation.findOneAndUpdate(
    { _id: conversation._id },
    { $set: { participants: participantsUpdate } },
    { new: true },
  );
  return updated;
};

/**
 *
 * @param {string} conversationId
 * @param {string} conversationName
 * @returns {Promise<ConversationDocument>}
 */
const updateConversationName = async (conversationId, conversationName) => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const updated = await Conversation.findOneAndUpdate(
    { _id: conversation._id },
    { $set: { name: conversationName } },
    { new: true },
  );
  return updated;
};

/**
 * Add Message to Conversation
 * @param {string} conversationId
 * @param {string} messageId
 * @returns {Promise<ConversationDocument>}
 */
const addMessageToConversationById = async (conversationId, messageId) => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const message = await Message.findOne({ _id: messageId });
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  /** @type {ConversationMessage} */
  const denormalizedMessage = {
    body: message.body,
    messageId: message._id,
    createdBy: {
      name: message.createdBy.name,
      userId: message.createdBy.userId,
    },
    createdAt: message.createdAt,
    _conversationId: conversation._id,
  };

  if (message.receivedBy) {
    denormalizedMessage.receivedBy = {
      name: message.receivedBy.name,
      userId: message.receivedBy.userId,
    };
  }

  const foundConversationMessage = conversation.messages.find(
    (/** @type {ConversationMessage} */ m) => m.messageId === message._id,
  );
  if (foundConversationMessage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Message already exists');
  }

  conversation.messages.push(denormalizedMessage);
  delete denormalizedMessage._conversationId;

  console.log('Denormalized Message:', denormalizedMessage);
  console.log('Last Messages:', conversation.lastMessage);

  conversation.lastMessage = denormalizedMessage;

  await conversation.save();
  return conversation;
};

/**
 *
 * @param {string} conversationId
 * @param {number} page
 */
const queryConversationMessages = async (conversationId, page) => {
  const PAGE_SIZE = 10;

  console.log('Querying messages for conversationId:', conversationId, 'page:', page);

  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const messages = conversation.messages;
  console.log('Messages TOTAL:', messages.length);
  if (!messages || messages.length === 0) {
    return [];
  }

  messages.sort((a, b) => b.createdAt - a.createdAt).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return messages;
};

module.exports = {
  createConversation,
  getConversationById,
  addParticipantsToConversation,
  removeParticipantFromConversation,
  updateConversationName,
  addMessageToConversationById,
  queryConversationMessages,
};
