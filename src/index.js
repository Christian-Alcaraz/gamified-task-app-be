const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./app');
const logger = require('./config/logger');
const seed = require('./seeds');

let server;
mongoose.connect(config.mongodbUrl).then(async () => {
  logger.info('Connected to MongoDB');
  // await seed();
  // server = app.listen(config.port, () => {
  //   logger.info(`Listening to port ${config.port}`);
  // });

  function weightedItemLevel(userLevel, minLevel, maxLevel, sigma = 3, samples = 1) {
    const levels = [];
    const weights = [];

    for (let lvl = minLevel; lvl <= maxLevel; lvl++) {
      levels.push(lvl);
      const weight = Math.exp(-0.5 * Math.pow((lvl - userLevel) / sigma, 2));
      if (lvl === userLevel) {
        weights.push(3);
        continue;
      }
      weights.push(weight);
    }

    const total = weights.reduce((a, b) => a + b, 0);
    const normalized = weights.map((w) => w / total);

    const loggedNormalized = normalized.map((w, i) => `Level: ${levels[i]} || Weight: ${w}`);

    console.log(JSON.stringify(loggedNormalized, null, 2));

    const pick = () => {
      const r = Math.random();
      let acc = 0;
      for (let i = 0; i < normalized.length; i++) {
        acc += normalized[i];
        if (r <= acc) return levels[i];
      }
      return levels[levels.length - 1];
    };

    if (samples === 1) return pick();
    return Array.from({ length: samples }, pick);
  }
  const currentLevel = 25;
  const minLevel = Math.max(currentLevel - 10, 0);
  const maxLevel = Math.min(currentLevel + 4, 100);
  const sigma = 5;
  const samples = 1;
  // Example
  console.log(
    'Inputs: \n',
    JSON.stringify({ currentLevel, minLevel, maxLevel, sigma, samples }, null, 2),
    '\nResults: ',
    weightedItemLevel(currentLevel, minLevel, maxLevel, sigma, samples),
  );
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
