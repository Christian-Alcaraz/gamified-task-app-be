//@ts-check
const mongoose = require('mongoose');
const { ITEM, STATUS, STATUSES } = require('../constants');

/**
 * @typedef {Object} Item
 * @property {string} name
 * @property {string} [modelName]
 * @property {string} description
 * @property {string} [texture]
 * @property {string} [icon]
 * @property {string} type
 * @property {string} [tags]
 * @property {Object} [attributes]
 * @property {Object} [usageAttributes]
 * @property {string} [cost]
 * @property {string} maxStackSize
 * @property {Array<string>} sources
 * @property {Array<Object>} baseStats
 * @property {Array<Object>} rollRanges
 */

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
      required: true,
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
      type: mongoose.Schema.Types.Array, // ['tag1', 'tag2']
    },
    createdBy: {
      name: String,
      userId: mongoose.Schema.Types.ObjectId,
    },
    updatedBy: {
      name: String,
      userId: mongoose.Schema.Types.ObjectId,
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

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
