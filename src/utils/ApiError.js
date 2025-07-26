class ApiError extends Error {
  constructor(statusCode, message, errorCode, isOperational = true, stack = '', validationErrors = {}) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.validationErrors = validationErrors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
