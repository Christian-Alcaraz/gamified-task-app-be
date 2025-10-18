const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { Item } = require('../models');
const { ITEM } = require('../constants');
const stringUtils = require('../utils/stringUtils');

const createItemModelName = (item) => {
  if (!item) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item is required');
  }

  const index = ITEM.TYPE_INDEX[item.type];
  const lowercased = item.name.toLowerCase().replace(/\s/g, '_');
  return `${index}_${lowercased}`;
};

const createItem = async (itemBody) => {
  const modelName = createItemModelName(itemBody);

  if (await getItemByModelName(modelName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item model name is already in use');
  }

  const body = {
    ...itemBody,
    modelName,
  };
  const item = await Item.create(body);
  return item;
};

const updateItemById = async (itemId, itemBody) => {
  const item = await getItemById(itemId);

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  const newModelName = createItemModelName(itemBody);
  if (await getItemByModelName(newModelName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item model name is already in use');
  }

  const body = {
    ...itemBody,
    modelName: newModelName,
  };

  Object.assign(item, body);
  await item.save();
  return item;
};

const getItemById = async (itemId) => {
  return Item.findOne({
    _id: itemId,
  });
};

const getItemByModelName = async (modelName) => {
  return Item.findOne({
    modelName,
  });
};

const getItems = async (query) => {
  const { pageIndex, pageSize, sort, search, name, type, tags, status } = query;

  const filter = {};

  if (search) {
    const searchRegex = stringUtils.escapeRegExp(search);
    filter.$or = [
      { name: { $regex: `.*${searchRegex}.*`, $options: 'i' } },
      { type: { $regex: `.*${searchRegex}.*`, $options: 'i' } },
      { tags: { $regex: `.*${searchRegex}.*`, $options: 'i' } },
      { status: { $regex: `.*${searchRegex}.*`, $options: 'i' } },
    ];
  } else {
    if (name) {
      filter.name = { name: { $regex: `.*${searchRegex}.*`, $options: 'i' } };
    }
    if (type) {
      filter.type = { type: { $regex: `.*${searchRegex}.*`, $options: 'i' } };
    }
    if (tags) {
      filter.tags = { tags: { $regex: `.*${searchRegex}.*`, $options: 'i' } };
    }
    if (status) {
      filter.status = { status: { $regex: `.*${searchRegex}.*`, $options: 'i' } };
    }
  }

  const sortBy = {};
  if (sort) {
    const [path, direction] = sort.split(':');
    sortBy[path] = direction === 'desc' ? -1 : 1;
  }

  const items = await Item.find(filter)
    .sort(sort)
    .skip(pageSize * pageIndex)
    .limit(pageSize || 9999);

  const totalItems = await Item.countDocuments(filter);

  return { records: items, total: totalItems };
};

// const patchItemStatusById = async (itemId, status) => {
//   const item = await getItemById(itemId);
//   if (!item) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
//   }

//   item.status = status;
//   await item.save();
//   return item;
// };

module.exports = { createItem, updateItemById, getItemById, getItems };
