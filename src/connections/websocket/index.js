const { Server: SocketIOServer, Socket } = require('socket.io');
const logger = require('../../config/logger');
const Router = require('./router.js');
const ApiError = require('../../utils/ApiError');
const { TOKEN, WS_STATUS, TOKEN_TYPE, SOCKET_TYPE, CLIENT_STATUS, SOCKET_TARGET } = require('../../constants');
const { tokenService, userService } = require('../../services');
const Middleware = require('./middleware');
const Controller = require('./controller');

/** @typedef {import('./router.js').ISocket} ISocket */
/** @typedef {import('../../types').IJWTPayload} IJWTPayload */
/** @typedef {import('../../models/user.model').UserDocument} UserDocument */
/** @typedef {import('./types').ISocketInMessage} ISocketInMessage */
/** @typedef {import('./types').ISocketOutMessage} ISocketOutMessage */

/** @typedef {{clients: ISocket[], userId: string, status: string}} ActiveUser */
class WebsocketServer {
  /** @type {ActiveUser[]} */
  users = [];
  /** @type {SocketIOServer} */
  io = undefined; // same with ws

  /** @type {Router} */
  router = undefined;

  /** @type {Middleware} */
  middleware = undefined;

  /**
   * Initialize Websocket Server
   * @param {SocketIOServer} httpServer
   */
  init(httpServer) {
    const opts = {
      allowUpgrades: true,
      transports: ['polling', 'websocket'],
      pingTimeout: 1000 * 9,
      pingInterval: 1000 * 3,
      httpCompression: true,
      cors: '*:*',
    };
    // @ts-expect-error -
    this.io = new SocketIOServer(httpServer);
    this.middleware = new Middleware();
    this.router = new Router(this.middleware);

    logger.info('[Websocket]:: Websocket Server initialized');

    this.middleware.generateMiddleware(this.io);
    this.startListeners();
  }

  /**
   * Start Websocket Event Listeners
   */
  startListeners() {
    this.io.on('connection', (/** @type {ISocket} */ socket) => {
      this.errorWrapper(() => this.onUserConnected(socket), socket);
    });
    this.io.on('error', (err) => this.handleServerError(err));
  }

  /**
   * Handles when user request upgraded to websocket protocol
   * @param {ISocket} socket
   */
  onUserConnected(socket) {
    this.validateUser(socket)
      .then(() => {
        socket.on(SOCKET_TYPE.MESSAGE, (message) =>
          this.errorWrapper(() => this.handleUserMessage(message, socket), socket),
        );

        socket.on(SOCKET_TYPE.REAUTH, (message) =>
          this.errorWrapper(() => this.reauthenticateUser(socket, message), socket),
        );

        socket.on(SOCKET_TYPE.DISCONNECT, () => this.logoutUser(socket));
      })
      .catch((error) => {
        const { message } = error;
        if (message === 'Token Expired') {
          this.handleTokenExpired(socket);
        } else {
          this.router.handleError(error, socket);
        }
      });
  }

  /**
   * @param {ISocket} socket
   * @param {any} message
   * @returns void
   * @description Reauthenticate User
   */
  reauthenticateUser(socket, message) {
    let mess = { userId: undefined, [TOKEN.AUTH]: undefined };

    const unauthorizedError = () => {
      throw new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Unauthorized Request');
    };

    try {
      mess = JSON.parse(message);
    } catch (error) {
      this.logoutUser(socket);
      return;
    }

    const token = mess[TOKEN.AUTH];
    /** @type {IJWTPayload} */
    let decoded;

    try {
      decoded = tokenService.verifyToken(token);
    } catch (error) {
      const { name } = error;
      if (name !== 'TokenExpiredError') unauthorizedError();
      this.logoutUser(socket);
      return;
    }

    if (!decoded || decoded.type !== TOKEN_TYPE.ACCESS) {
      this.logoutUser(socket);
      return;
    }

    const user = this.users.find((user) => user.userId === decoded?.sub);
    if (!user) {
      logger.info(`Client ${decoded?.sub} tries to reauthenticate while not existing in the active pool`);
      socket.disconnect(true);
      return;
    }

    user.status = CLIENT_STATUS.ONLINE;
    const userSocketIndex = user.clients.findIndex((client) => client.id === socket.id);
    const userSocket = user.clients[userSocketIndex];

    userSocket.handshake.query[TOKEN.AUTH] = token;
  }

  /**
   * Logouts User by removing it from the active pool and disconnecting the socket
   * @param {ISocket} socket
   */
  logoutUser(socket) {
    if (!socket.user || !socket.userId) return;

    this.users = this.users.filter((user) => user.userId !== socket.userId);
  }

  /**
   * Validate User from the token provided in the socket handshake
   * @param {ISocket} socket
   * @throws { ApiError } When the token is invalid or user not found
   */
  async validateUser(socket) {
    const unauthorizedError = () => {
      throw new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Unauthorized Request');
    };
    /** @type {string | string[] | undefined} */
    let token = socket.handshake.query?.[TOKEN.AUTH];

    if (!token || token.length === 0) unauthorizedError();
    token = Array.isArray(token) ? token[0] : token;

    /** @type {IJWTPayload} */
    let decoded;
    try {
      decoded = tokenService.verifyToken(token);
    } catch (error) {
      const { name } = error;
      if (name !== 'TokenExpiredError') unauthorizedError();
      throw new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Token Expired');
    }

    if (!decoded || decoded.type !== TOKEN_TYPE.ACCESS) unauthorizedError();

    const user = await userService.getUserById(decoded?.sub);
    if (!user) unauthorizedError();

    socket.user = user;

    await this.initializeUser(socket);
  }

  /**
   * Puts user info into its socket and adds the user to the active pool
   * @param {ISocket} socket
   */
  async initializeUser(socket) {
    const userId = socket.user._id;
    socket.userId = userId;
    socket.controller = new Controller();

    //Will have problem if user is online from different devices;
    this.users.push({ clients: [socket], userId, status: CLIENT_STATUS.ONLINE });
  }

  /**
   * Wraps socket event callbacks to handle errors uniformly
   * @param {Function} callback
   * @param {ISocket} socket
   */
  errorWrapper(callback, socket) {
    try {
      callback();
    } catch (error) {
      this.router.handleError(error, socket);
    }
  }

  /**
   * If a server error occurs, log it and close the server
   * @param {ApiError} err
   */
  handleServerError(err) {
    logger.error(err);
    this.close();
  }

  /**
   * Handles user socket message and routes it to the correct handler
   * @param {string} message
   * @param {ISocket} socket
   * @throws { ApiError } When the message is not of type json
   */
  handleUserMessage(message, socket) {
    const user = this.users.find((user) => user.userId === socket.userId);

    if (!user) {
      if (socket) {
        socket.disconnect(true);
      }
    }

    if (CLIENT_STATUS.TOKEN_EXPIRED === user?.status) {
      throw new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Token Expired');
    }

    /** @type {ISocketInMessage} */
    let msg = { target: undefined, subTarget: undefined, payload: undefined };

    try {
      msg = JSON.parse(message);
    } catch (_err) {
      return new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Incorrect body type. Data should be of type json');
    }

    switch (msg.target) {
      case SOCKET_TARGET.CHAT:
        return this.router.handleChatMessage(msg, socket);
      default:
        return new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Unknown target type');
    }
  }

  /**
   * Notify Client about Token Expiry
   * @param {ISocket} socket
   */
  handleTokenExpired(socket) {
    const userId = socket?.userId ?? socket?.user?._id;
    const user = this.users.find((user) => user.userId === userId);

    if (!user) {
      logger.error('This must not HAPPEN, user was not found from active pool');
      return;
    }

    user.status = CLIENT_STATUS.TOKEN_EXPIRED;
    socket.emit(SOCKET_TYPE.TOKEN_EXPIRED, 'Token Expired');
  }

  /**
   * Send Message to User who is in the Active Pool
   * @param {string} userId
   * @param {unknown} payload
   * @param {string} type
   */
  sendToUser(userId, payload, type = SOCKET_TYPE.CHAT_MESSAGE) {
    /** @type {ISocketOutMessage} */
    const formatted = { type, payload };
    const target = this.users.find((user) => user.userId === userId);

    if (target) {
      target.clients.forEach((client) => {
        client.emit(type, JSON.stringify(formatted));
      });
    }
  }

  /**
   * Find if user is in the active pool
   * @param {string} userId
   * @returns {boolean}
   */
  isOnline(userId) {
    const exists = this.users.find((user) => user.userId === userId);
    return !!exists;
  }

  /**
   * Close Websocket Server
   */
  close() {
    if (this.io) this.io.close();
    if (this.users.length > 0) {
      this.users.forEach((user) => {
        user.clients.forEach((/** @type {ISocket} */ client) => {
          client.disconnect(true);
        });
      });
    }
  }
}

module.exports = WebsocketServer;
