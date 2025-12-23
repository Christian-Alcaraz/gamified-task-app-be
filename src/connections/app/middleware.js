const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('../../config/config');
const morgan = require('../../config/morgan');
const { jwtStrategy } = require('../../config/passport');
const { errorConverter, errorHandler } = require('../../middlewares/error');

class Middleware {
  /**
   * Initialize middleware for the Express app
   * @param {Express} app
   */
  generateMiddleware(app) {
    if (config.env !== 'test') {
      app.use(morgan.successHandler);
      app.use(morgan.errorHandler);
    }

    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    //app.set('trust proxy', 1); What is trust proxy?

    // const whitelistedOrigins = [''];
    app.use(
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
    app.options('*', cors());

    app.use(helmet());
    // const helmetDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
    // whitelistedOrigins
    // app.use(
    //   helmet({
    //     contentSecurityPolicy: {
    //       useDefaults: false,
    //       directives: {
    //         ...helmetDirectives,
    //         'form-action': ["'self'", ...whitelistedOrigins],
    //         'script-src': ["'self'"],
    //         'default-src': ["'self'", 'data:'],
    //         'frame-ancestors': ["'self'", ...whitelistedOrigins],
    //         'frame-src': ["'self'", ...whitelistedOrigins],
    //         'connect-src': ["'self'", ...whitelistedOrigins],
    //       },
    //     },
    //   }),
    // );

    app.use(xss());
    app.use(mongoSanitize());
    app.use(compression());

    app.use(passport.initialize());
    passport.use('jwt', jwtStrategy);

    app.use((req, res, next) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }
  /**
   * Initialize error handler for the Express app
   * @param {Express} app
   */
  generateErrorHandler(app) {
    app.use(errorConverter);
    app.use(errorHandler);
  }
}

module.exports = Middleware;
