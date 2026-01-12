//@ts-check
const mongoose = require('mongoose');
const { ITEM, STATUS, STATUSES } = require('../constants');

/** @typedef {import('../types').IUserLog} IUserLog */

/**
 * @typedef {Object} Item
 * @property {mongoose.Types.ObjectId} [_id]
 * @property {string} name
 * @property {string} [modelName]
 * @property {string} description
 * @property {string} [texture]
 * @property {string} [icon]
 * @property {string} type
 * @property {string[]} [tags]
 * @property {Object} [attributes]
 * @property {Object} [usageAttributes]
 * @property {number} [cost]
 * @property {number} [maxStackSize]
 * @property {Array<string>} sources
 * @property {Array<Object>} baseStats
 * @property {Array<Object>} rollRanges
 * @property {IUserLog} [updatedBy]
 * @property {IUserLog} [createdBy]
 * @property {string} status
 */

/** @typedef {mongoose.Document & Item} ItemDocument */

/** @type {mongoose.Schema<ItemDocument>} */
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
    },
    description: {
      type: String,
    },
    texture: {
      type: String,
      // required: true,
    },
    icon: {
      type: String,
    },
    type: {
      type: String,
      enum: ITEM.TYPES,
      required: true,
    },
    attributes: {
      stackable: Boolean,
      // craftable: Boolean,
      // enchantable: Boolean,
      // tradeable: Boolean,
      // equippable: Boolean,
      // repairable: Boolean,
      // sockets: Boolean,
    },
    usageAttributes: {
      consumeOnUse: Boolean,
      cooldownDuration: Number,
      effectDuration: Number,
    },
    cost: {
      type: Number,
    },
    sources: [{ type: String, enum: ITEM.SOURCES }],
    baseStats: {
      type: mongoose.Schema.Types.Mixed, // [{ [statName]: [value] }]
    },
    //To be used alongside with rarityWeights with rolls evaluation
    rollRanges: {
      type: mongoose.Schema.Types.Mixed, // { [statName]: { min: number, max: number } }
    },
    maxStackSize: {
      type: Number,
    },
    tags: {
      type: [String], // ['tag1', 'tag2']
    },
    createdBy: {
      name: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    updatedBy: {
      name: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    status: {
      type: String,
      enum: STATUSES,
      default: STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<ItemDocument>} */
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
