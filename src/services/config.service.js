const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { Config } = require('../models');
const { CONFIG } = require('../constants');

/**
 * Get Config by name
 * @param {string} configName
 * @returns
 */
const getConfigByName = async (configName) => {
  const config = await Config.findOne({ name: configName });

  if (!config) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
  }

  return config;
};

/**
 * Get Classes from config
 * @returns {Promise<{class: any}>}
 */
const getClassesFromConfig = async () => {
  const config = await getConfigByName(CONFIG.CLASS_DEFAULTS);
  return { class: config.data.class };
};

module.exports = { getConfigByName, getClassesFromConfig };
