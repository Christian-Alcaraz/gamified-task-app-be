const Joi = require('joi');
const { ITEM, STATUSES } = require('../constants');
const JoiObjectId = require('./helpers/mongoObjectId');

const isCostRequired = (value, helpers) => {
  const { sources } = helpers.state.ancestors[0];
  const isValueNull = value === null || value === undefined;
  const isSourcesHasShop = sources && sources.includes(ITEM.SOURCE.SHOP);

  if (isSourcesHasShop && isValueNull) {
    return helpers.message('"cost" is required when "sources" includes "shop"');
  }
  return value;
};

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
      stackable: Joi.boolean().optional(),
      craftable: Joi.boolean().optional(),
      enchantable: Joi.boolean().optional(),
      tradeable: Joi.boolean().optional(),
      equippable: Joi.boolean().optional(),
      repairable: Joi.boolean().optional(),
      sockets: Joi.boolean().optional(),
    })
    .optional()
    .allow(null)
    .description('Item attributes'),
  usageAttributes: Joi.object()
    .keys({
      consumeOnUse: Joi.boolean().optional().description('Item consumeOnUse'),
      cooldownDuration: Joi.number().optional().description('Item cooldownDuration'),
      effectDuration: Joi.number().optional().description('Item effectDuration'),
    })
    .optional()
    .allow(null)
    .description('Item usageAttributes'),
  sources: Joi.array()
    .items(Joi.string().valid(...ITEM.SOURCES))
    .required()
    .description('Item sources'),
  cost: Joi.number().custom(isCostRequired, 'Cost Requirement Validation'),
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
      pageIndex: Joi.number().description('Page number'),
      pageSize: Joi.number().min(1).max(100).default(10).description('Items per page'),
      sort: Joi.alternatives()
        .try(Joi.valid(null), Joi.string().allow('').pattern(new RegExp('^\\w+:(asc|desc)$')))
        .optional()
        .description('Item Sort Query'),
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
