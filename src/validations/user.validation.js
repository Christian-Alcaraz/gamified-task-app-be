const Joi = require('joi');
const { USER_TYPES, STATUSES } = require('../constants');

const validation = {
  createUser: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      type: Joi.string().valid(...USER_TYPES),
    }),
  },
  getUserById: {
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  },
  getUsers: {
    query: Joi.object().keys({
      type: Joi.string().valid(...USER_TYPES),
      status: Joi.string().valid(...STATUSES),
    }),
  },
  updateUserById: {
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().min(8),
      type: Joi.string().valid(...USER_TYPES),
    }),
  },
  patchUserStatusById: {
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
    query: Joi.object().keys({
      status: Joi.string().valid(...STATUSES),
    }),
  },
};

module.exports = validation;
