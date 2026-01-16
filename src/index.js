const logger = require('./config/logger');
const { MongoFactory } = require('./connections/mongo');
const ExpressApp = require('./connections/app');
const State = require('./utils/state');
const WebsocketServer = require('./connections/websocket');

const close = () => {
  State.kill();
  process.exit(0);
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  close();
};

const listenForSignals = () => {
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  process.on('SIGTERM', () => {
    logger.warn('Server', 'Received signal SIGTERM. Gracefully closing');
    close();
  });
  process.on('SIGINT', () => {
    logger.warn('Server', 'Received signal SIGINT. Gracefully closing');
    close();
  });
};

const main = async () => {
  logger.info('[Server]:: Starting application...');
  const mongo = await MongoFactory.create();
  const app = new ExpressApp();
  const websocketServer = new WebsocketServer();

  State.mongo = mongo;
  State.app = app;
  State.websocketServer = websocketServer;

  app.init();
  websocketServer.init(app.server);
  listenForSignals();
};

main();
