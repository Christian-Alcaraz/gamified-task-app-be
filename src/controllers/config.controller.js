const httpStatus = require('http-status').status;
const { configService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getConfigByName = catchAsync(async (req, res, next) => {
  const configName = req.params.configName;
  const config = await configService.getConfigByName(configName);
  res.status(httpStatus.OK).send(config);
});

const getClassesFromConfig = catchAsync(async (req, res, next) => {
  const classes = await configService.getClassesFromConfig();
  res.status(httpStatus.OK).send(classes);
});

module.exports = { getClassesFromConfig, getConfigByName };
