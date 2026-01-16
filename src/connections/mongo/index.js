const mongoose = require('mongoose');
const config = require('../../config/config');
const logger = require('../../config/logger');
const seed = require('../../seeds');
const State = require('../../utils/state');
/**
 * @class Mongo
 */
class Mongo {
  async init() {
    return new Promise((resolve, reject) => {
      logger.info('[MongoDB]:: Connecting to MongoDB');

      mongoose
        .connect(config.mongodbUrl)
        .then(() => {
          logger.info('[MongoDB]:: MongoDB Instance connected');
        })
        .catch((err) => {
          logger.error('[MongoDB]:: MongoDB Instance connection failed', err);
          reject(err);
        });

      mongoose.connection.on('connected', async () => {
        logger.info('[MongoDB]:: Connected to MongoDB');
        await seed();
        resolve();
      });
      mongoose.connection.on('reconnected', () => {
        logger.warn('[MongoDB]:: MongoDB reconnected');
      });
      mongoose.connection.on('disconnected', () => {
        logger.error('[MongoDB]:: MongoDB disconnected');
      });
      mongoose.connection.on('error', (err) => {
        logger.error('[MongoDB]:: MongoDB connection error', err);
        State.kill();
      });
    });
  }

  disconnect() {
    mongoose.disconnect().catch((err) => {
      logger.error('[MongoDB]:: MongoDB cannot disconnect', err);
    });
  }
}

class MongoFactory {
  /** @type {Mongo | undefined} */
  static instance = undefined;

  /** @returns {Promise<Mongo>} */
  static async create() {
    if (!MongoFactory.instance) {
      await MongoFactory.createServer();
    }
    return MongoFactory.instance;
  }

  static async createServer() {
    MongoFactory.instance = new Mongo();
    await MongoFactory.instance.init();
  }
}

module.exports = {
  Mongo,
  MongoFactory,
};
