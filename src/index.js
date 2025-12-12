const logger = require('./config/logger');
const Mongo = require('./connections/mongo');
const ExpressApp = require('./connections/app');
const State = require('./utils/state');

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
  const mongo = await Mongo.create();
  const app = new ExpressApp();

  State.mongo = mongo;
  State.app = app;

  app.init();

  listenForSignals();
};

main();
