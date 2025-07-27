const mongoose = require('mongoose');
const httpStatus = require('http-status');
const httpCode = httpStatus.status;
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpCode.BAD_REQUEST : httpCode.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message, type, errors } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpCode.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpCode.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    type,
    errors,
  };

  if (config.env === 'dev' || config.env === 'test') {
    response.stack = err.stack;
  }

  if (config.env === 'dev') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
