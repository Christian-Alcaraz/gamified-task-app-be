const { Server: SocketIOServer } = require('socket.io');
const logger = require('../../config/logger');
const Router = require('./router.js');
const ApiError = require('../../utils/ApiError');
const {
  TOKEN,
  WS_STATUS,
  TOKEN_TYPE,
  SOCKET_SUB_TARGET,
  SOCKET_TYPE,
  CLIENT_STATUS,
  SOCKET_TARGET,
} = require('../../constants');
const { tokenService, userService } = require('../../services');
const Middleware = require('./middleware');

class WebsocketServer {
  users = [];
  io = undefined; // same with ws
  router = undefined;
  middleware = undefined;

  init(httpServer) {
    const opts = {
      allowUpgrades: true,
      transports: ['polling', 'websocket'],
      pingTimeout: 1000 * 9,
      pingInterval: 1000 * 3,
      httpCompression: true,
      cors: '*:*',
    };

    this.io = new SocketIOServer(httpServer);
    this.router = new Router();
    this.middleware = new Middleware();

    logger.info('[Websocket]:: Websocket Server initialized');

    this.middleware.generateMiddleware(this.io);
    this.startListeners();
  }

  startListeners() {
    this.io.on('connection', (socket) => {
      this.errorWrapper(() => this.onUserConnected(socket), socket);
    });
    this.io.on('error', (err) => this.handleServerError(err));
  }

  onUserConnected(socket) {
    this.validateUser(socket)
      .then(() => {
        socket.on(SOCKET_TYPE.MESSAGE, (message) =>
          this.errorWrapper(() => {
            //function handleMessage(message, socket);
          }),
        );

        socket.on(SOCKET_TYPE.REAUTH, (message) =>
          this.errorWrapper(() => this.reauthenticateUser(socket, message), socket),
        );
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

  reauthenticateUser(socket, message) {
    let mess = { userId: undefined, [TOKEN.AUTH]: undefined };

    try {
      mess = JSON.parse(message);
    } catch (error) {
      this.logoutUser(socket);
      return;
    }

    const token = mess[TOKEN.AUTH];
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
      socket.disconnect();
      return;
    }

    user.status = CLIENT_STATUS.ONLINE;
    const userSocketIndex = user.clients.findIndex((client) => client.id === socket.id);
    const userSocket = user.clients[userSocketIndex];

    userSocket.handshake.query[TOKEN.AUTH] = token;
  }

  logoutUser(socket) {
    this.users = this.users.filter((user) => user.userId !== socket.userId);
    socket.disconnect();
  }

  async validateUser(socket) {
    const unauthorizedError = () => {
      throw new ApiError(WS_STATUS.PROTOCOL_ERROR, 'Unauthorized Request');
    };

    const token = socket.handshake.query?.[TOKEN.AUTH];

    if (!token) unauthorizedError();
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

  async initializeUser(socket) {
    const userId = socket.user._id;
    socket.userId = userId;
    //Will have problem if user is online from different devices;

    this.users.push({ clients: [socket], userId, status: CLIENT_STATUS.ONLINE });
  }

  errorWrapper(callback, socket) {
    try {
      callback();
    } catch (error) {
      this.router.handleError(error, socket);
    }
  }

  handleServerError(err) {
    console.log('handleServerError');
    logger.error(err);
    this.close();

    //Todo: Disconnect all users
  }

  handleTokenExpired(socket) {
    const userId = socket.userId ?? socket.user._id;
    const user = this.users.find((user) => user.userId === userId);
    if (!user) {
      logger.error('This must not HAPPEN, user was not found from active pool');
      return;
    }

    user.status = CLIENT_STATUS.TOKEN_EXPIRED;
    socket.emit(SOCKET_TYPE.TOKEN_EXPIRED, 'Token Expired');
  }

  close() {
    if (this.io) this.io.close();
  }
}

module.exports = WebsocketServer;
