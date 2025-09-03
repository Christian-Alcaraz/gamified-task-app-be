const Joi = require('joi');
const { USER_TYPES, STATUSES } = require('../constants');

const validation = {
  createUser: {
    body: Joi.object().keys({
      email: Joi.string().email().required().description('User email'),
      password: Joi.string().min(8).required().description('User password'),
      type: Joi.string()
        .valid(...USER_TYPES)
        .description('User type'),
    }),
  },
  getUserById: {
    params: Joi.object().keys({
      userId: Joi.string().required().description('User ID'),
    }),
  },
  getUsers: {
    query: Joi.object().keys({
      type: Joi.string()
        .valid(...USER_TYPES)
        .description('User type'),
      status: Joi.string()
        .valid(...STATUSES)
        .description('User status'),
    }),
  },
  updateUserById: {
    params: Joi.object().keys({
      userId: Joi.string().required().description('User ID'),
    }),
    body: Joi.object().keys({
      email: Joi.string().email().description('User email'),
      password: Joi.string().min(8).description('User password'),
      type: Joi.string()
        .valid(...USER_TYPES)
        .description('User type'),
    }),
  },
  patchUserStatusById: {
    params: Joi.object().keys({
      userId: Joi.string().required().description('User ID'),
    }),
    query: Joi.object().keys({
      status: Joi.string()
        .valid(...STATUSES)
        .description('User status'),
    }),
  },
};

module.exports = validation;
