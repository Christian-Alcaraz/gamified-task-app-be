const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const config = require('../../config/config');

class Middleware {
  generateMiddleware(io) {
    io.engine.use(express.json({ limit: '10kb' }));
    io.engine.use(express.urlencoded({ extended: true }));
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
}

module.exports = Middleware;
