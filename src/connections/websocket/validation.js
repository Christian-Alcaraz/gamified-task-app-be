const Joi = require('joi');
const enums = require('../../constants');

const validation = {
  socketInMessage: Joi.object({
    target: Joi.string()
      .valid(...enums.SOCKET_TARGETS)
      .required()
      .description('Controller Name'),
    subTarget: Joi.string()
      .valid(...enums.SOCKET_SUB_TARGETS)
      .required()
      .description('Sub Method Name'),
    payload: Joi.object().required().description('Payload'),
  }),
  socketOutMessage: Joi.object({
    target: Joi.string()
      .valid(...enums.SOCKET_TARGETS)
      .required()
      .description('Target user ID'),
    payload: Joi.object().required().description('Payload'),
    state: Joi.string().allow('', null).description('State'),
  }),
  sendMessage: Joi.object({
    target: Joi.string().required().description('Target user ID'),
    message: Joi.string().required().description('Message content'),
    chatRoomId: Joi.string().required().description('Chat Room ID'),
  }),
  getMessages: Joi.object({
    page: Joi.number().required().description('Page number'),
  }),
  readMessage: Joi.object({
    chatId: Joi.string().required().description('Chat ID'),
    userId: Joi.string().required().description('User ID'),
  }),
  getUnreadMessages: Joi.object({
    page: Joi.number().required().description('Page number'),
  }),
  getDetailedMessages: Joi.object({
    page: Joi.number().required().description('Page number'),
    target: Joi.string().required().description('Target user ID'),
  }),
};

module.exports = validation;
