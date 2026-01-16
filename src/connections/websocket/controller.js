const WebsocketService = require('./service');

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
    await this.service.sendMessage(user._id, data.receiver, data.chatRoomId, data.body);
  }
}

module.exports = Controller;
