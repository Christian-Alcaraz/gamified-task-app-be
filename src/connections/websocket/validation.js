const Joi = require('joi');
const enums = require('../../constants');

const validation = {
  socketInMessage: {
    target: Joi.string()
      .valid(...enums.SOCKET_TARGETS)
      .required()
      .description('Controller Name'),
    subTarget: Joi.string()
      .valid(...enums.SOCKET_SUB_TARGETS)
      .required()
      .description('Sub Method Name'),
    payload: Joi.object().required().description('Payload'),
  },
  socketOutMessage: {
    target: Joi.string()
      .valid(...enums.SOCKET_TARGETS)
      .required()
      .description('Target user ID'),
    payload: Joi.object().required().description('Payload'),
    state: Joi.string().allow('', null).description('State'),
  },
  sendMessage: {
    conversationId: Joi.string().required().description('Conversation ID'),
    target: Joi.string().required().description('Target user ID'),
    message: Joi.string().required().description('Message content'),
  },
  getMessages: {
    page: Joi.number().required().description('Page number'),
    conversationId: Joi.string().allow('', null).description('Conversation ID'),
  },
  readMessage: {
    chatId: Joi.string().required().description('Chat ID'),
    userId: Joi.string().required().description('User ID'),
  },
  getUnreadMessages: {
    page: Joi.number().required().description('Page number'),
  },
  getDetailedMessages: {
    page: Joi.number().required().description('Page number'),
    target: Joi.string().required().description('Target user ID'),
  },
};

module.exports = validation;
