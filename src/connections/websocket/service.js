const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status').status;
const { messageService, conversationService } = require('../../services');

/** @typedef {import('../../models/chatRoom.model').ChatRoomDocument} ChatRoomDocument */
/** @typedef {import('../../models/message.model').MessageDocument} MessageDocument */
/** @typedef {import('../../models/conversation.model').ConversationDocument} ConversationDocument */

class Service {
  /**
   * @param {string} senderId
   * @param {string} receiverId
   * @param {string} body
   * @param {string} conversationId
   */
  async sendMessage(senderId, receiverId, conversationId, body) {
    const messageBody = { body };
    const conversation = await conversationService.getConversationById(conversationId);
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }

    const message = await messageService.createMessage(messageBody, senderId, receiverId, conversationId);
    await conversationService.addMessageToConversationById(conversation._id, message._id);
  }

  /**
   * @param {string} conversationId
   * @param {number} page
   * @returns
   */
  async getMessages(conversationId, page) {
    return await conversationService.queryConversationMessages(conversationId, page);
  }

  /**
   *
   * @param {string} messageId
   * @param {string} userId
   * @returns {Promise<MessageDocument>}
   */
  async readMessage(messageId, userId) {
    return await messageService.readMessage(messageId, userId);
  }
}

module.exports = Service;
