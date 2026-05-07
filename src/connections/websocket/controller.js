const WebsocketService = require('./service');
const State = require('../../utils/state');
const ApiError = require('../../utils/ApiError');
const { SOCKET_TYPE } = require('../../constants');
const httpStatus = require('http-status').status;

/** @typedef {import('../../models/user.model').UserDocument} UserDocument */
/** @typedef {import('./types').ISocketInMessage} ISocketInMessage */
/** @typedef {import('./types').ISocketOutMessage} ISocketOutMessage */
/** @typedef {import('./types').ISocketSendMessageDto} ISocketSendMessageDto */
/** @typedef {import('./types').ISocketSendMessageBody} ISocketSendMessageBody */
/** @typedef {import('./types').ISocketGetMessageBody} ISocketGetMessageBody */
/** @typedef {import('./types').ISocketGetDetailedBody} ISocketGetDetailedBody */
/** @typedef {import('./types').ISocketReadMessageBody} ISocketReadMessageBody */

class Controller {
  //Todo: implement message queue Kafka/RabbitMQ/Redis
  /** @type {WebsocketService} */
  _service = undefined;

  constructor() {
    this._service = new WebsocketService();
  }

  get service() {
    return this._service;
  }

  /**
   *
   * @param {ISocketSendMessageDto} data
   * @param {UserDocument} user
   */
  async sendMessage(data, user) {
    if (data.receiver === user._id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot send message to yourself');
    }
    await this.service.sendMessage(user._id, data.receiver, data.conversationId, data.body);

    // State.websocketServer.sendToUser(
    //   data.receiver,
    //   { body: data.body, sender: user._id, receiver: data.receiver, conversationId: data.conversationId },
    //   SOCKET_TYPE.MESSAGE,
    // );
  }

  /**
   *
   * @param {ISocketGetMessageBody} data
   * @param {UserDocument} user
   */
  async getMessages(data, user) {
    const messages = await this.service.getMessages(data.conversationId, data.page);
    return !messages || messages.length === 0 ? [] : messages;
  }

  /**
   * Read message
   * @param {ISocketReadMessageBody} data
   * @param {UserDocument} user
   */
  async readMessage(data, user) {
    if (data.userId !== user._id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot read message of other user');
    }

    await this.service.readMessage(data.messageId, user._id);
  }
}

module.exports = Controller;
