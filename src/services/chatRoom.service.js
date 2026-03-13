const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { User, Message, ChatRoom } = require('../models');
const userService = require('./user.service');

/** @typedef {import('../models/chatRoom.model').ChatRoomDocument} ChatRoomDocument */
/** @typedef {import('../models/chatRoom.model').ChatRoomMessage} ChatRoomMessage */
/** @typedef {import('../models/user.model').UserDocument} UserDocument */
/** @typedef {import('../types').IUserLog} IUserLog */
/** @typedef {import('../types').IQueryFilter} IQueryFilter */

/**
 * Todo: Add Roles for Chat Room permissions (edit, rename, add participants, remove participants);
 */

/**
 * Creates ChatRoom
 * @param {string} creatorId
 * @param {string} participantsId
 * @param {string} [chatRoomName]
 * @returns {Promise<ChatRoomDocument>}
 */
const createChatRoom = async (creatorId, participantsId, chatRoomName) => {
  const creator = await userService.getUserById(creatorId);
  if (!creator) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found');
  }

  const participants = participantsId.split(',').filter((/** @type {string} */ u) => u !== creatorId);
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

  const CHAT_ROOM_NAME =
    chatRoomName ?? retrievedParticipantsFromDB.map((/** @type {UserDocument} */ u) => u.character.name).join(', ');

  const chatRoom = await ChatRoom.create({
    participants: retrievedParticipantsFromDB.map((/** @type {UserDocument} */ u) => ({
      name: u.character.name,
      userId: u._id,
      role: 'Member', //Todo: chatRoom Roles enum
    })),
    createdBy: {
      name: creator.character.name,
      userId: creator._id,
    },
    name: CHAT_ROOM_NAME,
    isGroupChat: false, //Todo: have option for creating Group Chat Room in createChatRoom()
  });

  return chatRoom;
};

/**
 * Get ChatRoom by its ID
 * @param {string} chatRoomId
 * @returns {Promise<ChatRoomDocument>}
 */
const getChatRoomById = async (chatRoomId) => {
  return await ChatRoom.findOne({ _id: chatRoomId });
};

/**
 * Add Participant/s to ChatRoom
 * @param {string} chatRoomId
 * @param {string} participantsId
 */
const addParticipantsToChatRoom = async (chatRoomId, participantsId) => {
  const chatRoom = await getChatRoomById(chatRoomId);
  if (!chatRoom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ChatRoom not found');
  }

  const participantsSplit = participantsId.split(',');
  const participantsHasAtleastOneValue = participantsSplit.length > 0 && !!participantsSplit[0];
  if (!participantsHasAtleastOneValue) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Participants not found');
  }

  const participantsUpdate = chatRoom.participants.map((p) => p);

  participantsSplit.forEach(async (pId) => {
    const exists = chatRoom.participants.some((/** @type {IUserLog} */ p) => p.userId.toString() === pId);
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

  const updated = await ChatRoom.findOneAndUpdate(
    { _id: chatRoom._id },
    { $set: { participants: participantsUpdate } },
    { new: true },
  );
  return updated;
};

/**
 *
 * @param {string} chatRoomId
 * @param {string} participantsId
 * @returns
 */
const removeParticipantFromChatRoom = async (chatRoomId, participantsId) => {
  const chatRoom = await getChatRoomById(chatRoomId);
  if (!chatRoom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ChatRoom not found');
  }

  const blacklist = participantsId.split(',');
  const blacklistHasAtleastOneValue = blacklist.length > 0 && !!blacklist[0];
  if (!blacklistHasAtleastOneValue) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Participants not found');
  }

  const participantsUpdate = chatRoom.participants.filter(
    (/** @type {IUserLog} */ p) => !blacklist.includes(p.userId.toString()),
  );

  const updated = await ChatRoom.findOneAndUpdate(
    { _id: chatRoom._id },
    { $set: { participants: participantsUpdate } },
    { new: true },
  );
  return updated;
};

const updateChatRoomName = async (chatRoomId, chatRoomName) => {
  const chatRoom = await getChatRoomById(chatRoomId);
  if (!chatRoom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ChatRoom not found');
  }

  const updated = await ChatRoom.findOneAndUpdate({ _id: chatRoom._id }, { $set: { name: chatRoomName } }, { new: true });
  return updated;
};

/**
 * Add Message to ChatRoom
 * @param {string} chatRoomById
 * @param {string} messageId
 * @returns {Promise<ChatRoomDocument>}
 */
const addMessageToChatRoomById = async (chatRoomById, messageId) => {
  const chatRoom = await getChatRoomById(chatRoomById);
  if (!chatRoom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ChatRoom not found');
  }

  const message = await Message.findOne({ _id: messageId });
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  /** @type {ChatRoomMessage} */
  const denormalizedMessage = {
    body: message.body,
    messageId: message._id,
    createdBy: {
      name: message.createdBy.name,
      userId: message.createdBy.userId,
    },
    createdAt: message.createdAt,
    _chatRoomId: chatRoom._id,
  };

  if (message.receivedBy) {
    denormalizedMessage.receivedBy = {
      name: message.receivedBy.name,
      userId: message.receivedBy._id,
    };
  }

  const foundChatMessage = chatRoom.messages.find((/** @type {ChatRoomMessage} */ m) => m.messageId === message._id);
  if (foundChatMessage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Message already exists');
  }

  chatRoom.messages.push(denormalizedMessage);
  await chatRoom.save();
  return chatRoom;
};

/**
 *
 * @param {string} chatRoomId
 * @param {number} page
 */
const queryChatRoomMessages = async (chatRoomId, page) => {
  const PAGE_SIZE = 10;

  const chatRoom = await getChatRoomById(chatRoomId);
  if (!chatRoom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ChatRoom not found');
  }

  const messages = chatRoom.messages.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  return messages;
};

module.exports = {
  createChatRoom,
  getChatRoomById,
  addParticipantsToChatRoom,
  removeParticipantFromChatRoom,
  updateChatRoomName,
  addMessageToChatRoomById,
  queryChatRoomMessages,
};
