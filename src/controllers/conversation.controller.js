const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');
const { createConversation } = require('../services/conversation.service');

const createConversation = catchAsync(async (req, res, next) => {
  const { creatorId, participantsId, conversationType, conversationName } = req.body;
  const conversation = await conversationService.createConversation(
    creatorId,
    participantsId,
    conversationType,
    conversationName,
  );
  res.status(httpStatus.CREATED).send(conversation);
});

const getConversationById = catchAsync(async (req, res, next) => {
  const conversationId = req.params.conversationId;
  const conversation = await conversationService.getConversationById(conversationId);
  res.status(httpStatus.OK).send(conversation);
});

module.exports = { createConversation, getConversationById };
