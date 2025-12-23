const express = require('express');
const Middleware = require('./middleware');
const config = require('../../config/config');
const authLimiter = require('../../middlewares/rateLimiter');
const routes = require('../../routes/v1');
const httpStatus = require('http-status').status;
const ApiError = require('../../utils/ApiError');
const logger = require('../../config/logger');
const http = require('http');
class App {
  app = null;
  middleware = null;
  server = null;
  env = 'development';

  constructor() {
    this.app = express();
    this.middleware = new Middleware();
    this.env = config.env;
  }

  init() {
    this.initMiddleware();
    this.initRouter();
    this.initServer();

    this.initFourOhFour();
    this.initErrorHandler();
  }

  close() {
    logger.warn('Closing Server');
    if (!this.server) return;

    this.server.closeAllConnections();
    this.server.close();
  }

  initServer() {
    this.server = http.createServer(this.app);
    this.server.listen(config.port, () => {
      if (this.env !== 'production') {
        logger.info(`[Server]:: Server started on port ${config.port}`);
      } else {
        console.log(`[Server]:: Server started on port ${config.port}`);
      }
    });
  }

  initMiddleware() {
    this.middleware.generateMiddleware(this.app);
  }

  initRouter() {
    if (['production', 'staging'].includes(config.env)) {
      this.app.use('/v1/auth', authLimiter);
      this.app.use('/v1', routes);
    } else {
      this.app.use('/api/v1', routes);
    }
  }

  initFourOhFour() {
    this.app.all(/(.*)/, (req, res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, 'Resource not found or is inaccessible for you'));
    });
  }

  initErrorHandler() {
    this.middleware.generateErrorHandler(this.app);
  }
}

module.exports = App;
