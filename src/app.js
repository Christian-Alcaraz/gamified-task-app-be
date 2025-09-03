const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// For ejs template if needed
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/config/templates');

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use(mongoSanitize());

app.use(compression());

// for production whitelisting
// const whitelistedOrigins = [''];
app.use(
  cors((req, callback) => {
    const origin = req.headers.origin;

    if (config.env !== 'production') {
      return callback(null, { origin: true });
    }

    // if (!whitelistedOrigins.includes(origin)) {
    //   return callback(new ApiError(httpStatus.NOT_FOUND, 'Not Found'), { origin: false });
    // }

    return callback(null, { origin: true });
  }),
);
app.options('*', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

if (['production', 'staging'].includes(config.env)) {
  app.use('/v1/auth', authLimiter);
  app.use('/v1', routes);
} else {
  app.use('/api/v1', routes);
}

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Request not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
