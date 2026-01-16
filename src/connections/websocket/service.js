const { Message, ChatRoom, User } = require('../../models');
const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose');
const httpStatus = require('http-status').status;

/** @typedef {import('../../models/chatRoom.model').ChatRoomDocument} ChatRoomDocument */

class Service {
  /**
   * @param {string} senderId
   * @param {string} receiverId
   * @param {string} body
   * @param {string} chatRoomId
   */
  async sendMessage(senderId, receiverId, chatRoomId, body) {
    //Todo: Separate sendMessage for Group Chat Room and Private Chat Room
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sender/Receiver not Found');
    }

    const senderUserLog = {
      name: sender.name,
      userId: sender._id,
    };

    const receiverUserLog = {
      name: receiver.name,
      userId: receiver._id,
    };

    /** @type {ChatRoomDocument} */
    let chatRoom = await ChatRoom.findOne({ _id: chatRoomId });

    //Todo: Create chatRoomService.createChatRoom()
    if (!chatRoom) {
      const participants = [senderUserLog, receiverUserLog];
      chatRoom = await ChatRoom.create({
        participants,
        isGroupChat: true, //Todo: have option for creating Group Chat Room in createChatRoom()
      });
    }

    //Todo: Create messageService.createMessage()
    const messageBody = {
      body,
      receivedBy: receiverUserLog,
      createdBy: senderUserLog,
      _chatId: chatRoom._id,
    };

    const message = await Message.create(messageBody);
    const newChatRoomMessage = {
      body,
      messageId: message._id,
      sender: senderUserLog,
      receiver: receiverUserLog,
      createdAt: message.createdAt,
      _chatId: chatRoom._id,
    };

    chatRoom.messages.push(newChatRoomMessage);
    chatRoom.lastMessage = newChatRoomMessage;
    await chatRoom.save();
  }
}

module.exports = Service;
