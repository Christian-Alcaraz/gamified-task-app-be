const Joi = require('joi');
const { ITEM, STATUSES } = require('../constants');
const JoiObjectId = require('./helpers/mongoObjectId');

const ItemBody = {
  name: Joi.string().required().description('Item name'),
  description: Joi.string().allow('', null).description('Item description'),
  texture: Joi.string().allow('', null).description('Item Texture (WIP, must setup s3 first)'),
  icon: Joi.string().allow('', null).description('Item Icon (WIP, must setup s3 first)'),
  type: Joi.string()
    .valid(...ITEM.TYPES)
    .required()
    .description('Item type'),
  attributes: Joi.object()
    .keys({
      stackable: Joi.boolean().optional().description('Item stackable'),
      craftable: Joi.boolean().optional().description('Item craftable'),
      enchantable: Joi.boolean().optional().description('Item enchantable'),
      tradeable: Joi.boolean().optional().description('Item tradeable'),
      equippable: Joi.boolean().optional().description('Item equippable'),
      repairable: Joi.boolean().optional().description('Item repairable'),
      sockets: Joi.boolean().optional().description('Item sockets'),
    })
    .optional()
    .allow(null),
  // usageAttributes: Joi.object().keys({
  //   consumeOnUse: Joi.boolean().optional().description('Item consumeOnUse'),
  //   cooldownDuration: Joi.number().optional().description('Item cooldownDuration'),
  //   effectDuration: Joi.number().optional().description('Item effectDuration'),
  // }),
  cost: Joi.number().optional().description('Item cost'),
  sources: Joi.array()
    .items(Joi.string().valid(...ITEM.SOURCES))
    .required()
    .description('Item sources'),
  baseStats: Joi.array()
    .items(Joi.object().pattern(Joi.string().valid(...ITEM.BASE_STATS), Joi.number().required()))
    .description('Item Base Stats'),
  rollRanges: Joi.array().items(
    Joi.object().pattern(
      Joi.string().valid(...ITEM.BASE_STATS),
      Joi.object().keys({
        min: Joi.number().min(1).max(999).required(),
        max: Joi.number().min(1).max(999).required(),
      }),
    ),
  ),
  maxStackSize: Joi.number().min(1).max(999).optional().description('Item maxStackSize'),
  tags: Joi.array().items(Joi.string()).optional().description('Item tags'),
};

const validation = {
  createItem: {
    body: Joi.object().keys(ItemBody),
  },
  updateItemById: {
    params: Joi.object().keys({
      itemId: JoiObjectId().required().description('Item ID'),
    }),
    body: Joi.object().keys(ItemBody),
  },
  getItemById: {
    params: Joi.object().keys({
      itemId: JoiObjectId().required().description('Item ID'),
    }),
  },
  getItems: {
    query: Joi.object().keys({
      page: Joi.number().min(1).default(1).description('Page number'),
      limit: Joi.number().min(1).max(100).default(10).description('Items per page'),
      sort: Joi.string().pattern(new RegExp('^[a-zA-Z]+:(asc|desc)$')).description('Sort format: field:asc|desc'),
      search: Joi.string().allow('', null).description('Search term'),
      name: Joi.string().allow('', null).description('Item name'),
      type: Joi.string()
        .valid(...ITEM.TYPES)
        .description('Item type'),
      tags: Joi.string().allow('', null).description('Item tags'),
      status: Joi.string()
        .valid(...STATUSES)
        .description('Item status'),
    }),
  },
};

module.exports = validation;
