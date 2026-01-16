const config = require('../../config/config');
const { SOCKET_TYPE, SOCKET_SUB_TARGET, WS_STATUS } = require('../../constants');
const ApiError = require('../../utils/ApiError');
const Controller = require('./controller');
const Middleware = require('./middleware');
const validation = require('./validation');
const State = require('../../utils/state');

/** @typedef {import('socket.io').Socket} Socket */
/** @typedef {import('./controller')} WebsocketController */
/** @typedef {import('../../models/user.model').UserDocument} UserDocument */
/** @typedef {import('./types').ISocketInMessage} ISocketInMessage */
/** @typedef {import('./types').ISocketOutMessage} ISocketOutMessage */
/** @typedef {import('./types').ISocketSendMessageDto} ISocketSendMessageDto */
/** @typedef {import('./types').ISocketSendMessageBody} ISocketSendMessageBody */
/** @typedef {import('./types').ISocketGetMessageBody} ISocketGetMessageBody */
/** @typedef {import('./types').ISocketGetDetailedBody} ISocketGetDetailedBody */
/** @typedef {import('./types').ISocketReadMessageBody} ISocketReadMessageBody */

/**
 * @typedef {Socket & {user: UserDocument, userId: string, controller: WebsocketController}} ISocket
 */

class Router {
  /** @type {Middleware} */
  middleware = undefined;

  /**
   * @param {Middleware} middleware
   */
  constructor(middleware) {
    this.middleware = middleware;
  }

  /**
   * Handle Errors and send error messages to client
   * @param {ApiError} err
   * @param {ISocket} socket
   */
  handleError(err, socket) {
    if (config.env !== 'production') {
      console.trace(err);
    }

    const { message, statusCode, name } = err;

    const body = JSON.stringify({
      message,
      code: statusCode,
      name,
    });

    socket.emit(SOCKET_TYPE.ERROR, body);
  }

  /**
   * Routes chat messages to their respective handlers
   * @param {ISocketInMessage} message
   * @param {ISocket} socket
   */
  handleChatMessage(message, socket) {
    this.middleware.validateSocketMessage(validation.socketInMessage, message);
    const payload = message.payload;

    switch (message.subTarget) {
      case SOCKET_SUB_TARGET.SEND:
        return this.sendMessage(payload, socket);
      case SOCKET_SUB_TARGET.READ:
        return this.readMessage(payload, socket);
      case SOCKET_SUB_TARGET.GET:
        return this.getMessages(payload, socket);
      case SOCKET_SUB_TARGET.GET_UNREAD:
        return this.getUnreadMessages(payload, socket);
      default:
        return new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Unknown SubTarget');
    }
  }

  /**
   * Sends message to the targeted receiver
   * @param {ISocketSendMessageBody} payload
   * @param {ISocket} socket
   */
  sendMessage(payload, socket) {
    this.middleware.validateSocketMessage(validation.sendMessage, payload);

    /** @type {ISocketSendMessageDto} */
    let prepared = { body: undefined, receiver: undefined, sender: undefined, chatRoomId: undefined };

    prepared = {
      body: payload.message,
      receiver: payload.target,
      sender: socket.userId,
      chatRoomId: payload.chatRoomId,
    };

    socket.controller
      .sendMessage(prepared, socket.user)
      .then(() => {
        socket.emit(SOCKET_TYPE.SUCCESS);

        const { target, message } = payload;
        const isOnline = State.websocketServer.isOnline(target);
        if (isOnline) {
          State.websocketServer.sendToUser(target, message, SOCKET_TYPE.CHAT_MESSAGE);
        }
      })
      .catch((error) => {
        this.handleError(error, socket);
      });
  }

  /**
   * Read message
   * @param {ISocketReadMessageBody} payload
   * @param {ISocket} socket
   */
  readMessage(payload, socket) {}

  getMessages(payload, socket) {}

  getUnreadMessages(payload, socket) {}
}

module.exports = Router;
