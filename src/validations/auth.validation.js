const Joi = require('joi');

const validation = {
  register: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  },
};

module.exports = validation;
