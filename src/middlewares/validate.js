const Joi = require('joi');
const _ = require('lodash');

const validate = (schema) => (req, res, next) => {
  const validSchema = _.pick(schema, ['params', 'query', 'body']);
  const object = _.pick(req, Object.keys(validSchema));

  const { error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    return res.status(400).json({
      message: error.details.map((details) => details.message).join(', '),
      type: 'VALIDATION_ERROR',
    });
  }

  next();
};

module.exports = validate;
