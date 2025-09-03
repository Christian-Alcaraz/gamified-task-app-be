const Joi = require('joi');

const validation = {
  register: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  },
  login: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  },
};

module.exports = validation;
