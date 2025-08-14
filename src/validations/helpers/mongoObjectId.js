const Joi = require('joi');
const mongoose = require('mongoose');

const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value; // valid
  }, 'ObjectId validation');

module.exports = objectId;
