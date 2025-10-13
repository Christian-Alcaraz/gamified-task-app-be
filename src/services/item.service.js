const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { Item } = require('../models');
const { ITEM } = require('../constants');
const stringUtils = require('../utils/stringUtils');

const createItem = async (itemBody) => {
  const item = await Item.create(itemBody);
  return item;
};

const updateItemById = async (itemId, itemBody) => {
  const item = await getItemById(itemId);

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  Object.assign(item, itemBody);
  await item.save();
  return item;
};

const getItemById = async (itemId) => {
  return Item.findOne({
    _id: itemId,
  });
};

const getItems = async (query) => {
  const { page, limit, sort, search, name, type, tags, status } = query;

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
    .skip(limit * (page - 1))
    .limit(limit || 9999);

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
