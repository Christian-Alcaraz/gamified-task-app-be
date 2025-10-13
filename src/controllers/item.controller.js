const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const { itemService } = require('../services');

const createItem = catchAsync(async (req, res, next) => {
  const itemBody = req.body;
  const item = await itemService.createItem(itemBody);
  res.status(httpStatus.CREATED).json(item);
});

const updateItemById = catchAsync(async (req, res, next) => {
  const itemId = req.params.itemId;
  const itemBody = req.body;
  const item = await itemService.updateItemById(itemId, itemBody);
  res.status(httpStatus.OK).json(item);
});

const getItemById = catchAsync(async (req, res, next) => {
  const itemId = req.params.itemId;
  const item = await itemService.getItemById(itemId);
  res.status(httpStatus.OK).json(item);
});

const getItems = catchAsync(async (req, res, next) => {
  const result = await itemService.getItems(req.query);
  res.status(httpStatus.OK).send(result);
});

module.exports = { createItem, updateItemById, getItemById, getItems };
