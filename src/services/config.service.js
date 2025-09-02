const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { Config } = require('../models');
const { CONFIG } = require('../constants');

const getConfigByName = async (configName) => {
  const config = await Config.findOne({ name: configName });

  if (!config) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
  }

  return config;
};

const getClassesFromConfig = async () => {
  const config = await getConfigByName(CONFIG.CLASS_DEFAULTS);
  return { class: config.data.class };
};

module.exports = { getConfigByName, getClassesFromConfig };
