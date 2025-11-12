const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    APP_NAME: Joi.string().required(),

    NODE_ENV: Joi.string().valid('production', 'staging', 'dev', 'test'),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_RESET_PASSWORD_SECRET: Joi.string().required(),

    JWT_AUTH_TOKEN_EXPIRATION_TIME_MINUTES: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAYS: Joi.string().required(),
    JWT_RESET_PASSWORD_EXPIRATION_TIME_MINUTES: Joi.string().required(),

    ADMIN_ID: Joi.string().required(),
    ADMIN_EMAIL: Joi.string().required(),
    ADMIN_PASSWORD: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  appName: envVars.APP_NAME,

  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongodbUrl: envVars.MONGODB_URL,

  jwt: {
    secret: envVars.JWT_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    resetPasswordSecret: envVars.JWT_RESET_PASSWORD_SECRET,
    authTokenExpirationMins: envVars.JWT_AUTH_TOKEN_EXPIRATION_TIME_MINUTES,
    refreshTokenExpirationDays: envVars.JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAYS,
    resetPasswordExpirationMins: envVars.JWT_RESET_PASSWORD_EXPIRATION_TIME_MINUTES,
  },
  adminCredentials: {
    id: envVars.ADMIN_ID,
    email: envVars.ADMIN_EMAIL,
    password: envVars.ADMIN_PASSWORD,
  },
};
