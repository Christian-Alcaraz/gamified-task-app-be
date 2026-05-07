const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const config = require('../../config/config');
const Joi = require('joi');
const _ = require('lodash');
const ApiError = require('../../utils/ApiError');
const { Server: SocketIOServer } = require('socket.io');
const httpStatus = require('http-status').status;

class Middleware {
  /**
   * Initialize middleware for the Socket.IO server
   * @param {SocketIOServer} io
   */
  generateMiddleware(io) {
    io.engine.use(express.json({ limit: '10kb' }));
    io.engine.use(express.urlencoded({ extended: true }));
    // @ts-expect-error helmet is callable at runtime
    io.engine.use(helmet());
    // const whitelistedOrigins = [''];
    io.engine.use(
      cors((req, callback) => {
        const origin = req.headers.origin;
        if (config.env !== 'production') {
          return callback(null, { origin: true, credentials: true });
        }
        // if (!whitelistedOrigins.includes(origin)) {
        //   return callback(new ApiError(httpStatus.NOT_FOUND, 'Not Found'), { origin: false });
        // }

        return callback(null, { origin: true, credentials: true });
      }),
    );
    io.engine.use(xss());
    io.engine.use(compression());
  }

  /**
   *
   * @param {Object} schema - Joi validation schema
   * @param {Object} data - Message data to validate
   * @returns {Object}
   * @throws {ApiError}
   */
  validateSocketMessage(schema, data) {
    const object = _.pick(data, Object.keys(schema));
    const { value, error } = Joi.compile(schema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object);

    // console.info('Validation Schema Keys:', Object.keys(schema));
    // console.info('Validation Schema:', object);
    // console.info('Validation Result:', { value, error });

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(', ')
        .replaceAll('"', '');
      throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
    return value;
  }
}

module.exports = Middleware;
