//@ts-check
const mongoose = require('mongoose');
const { ITEM } = require('../constants');

/**
 * @typedef {Object} ItemInstance
 * @property {mongoose.Types.ObjectId} [_id]
 * @property {string} name
 * @property {string} description
 * @property {string} texture
 * @property {string} type
 * @property {string} [tags]
 * @property {Object} [attributes]
 * @property {Object} [usageAttributes]
 * @property {string} [cost]
 * @property {string} currentStackSize
 * @property {string} maxStackSize
 * @property {Array<string>} sources
 */

const itemInstanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    texture: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ITEM.TYPES,
      required: true,
    },
    /**
     * {
     *    [statName]: [value] - sum of baseStats and the rolled values of item definition (item model)
     *    strength: 10
     * }
     */
    stats: {
      type: mongoose.Schema.Types.Mixed,
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
    currentStackSize: {
      type: Number,
    },
    maxStackSize: {
      type: Number,
    },
    tags: {
      type: mongoose.Schema.Types.Array,
    },
    _itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    user: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    updatedBy: {
      name: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  },
);

const ItemInstance = mongoose.model('ItemInstance', itemInstanceSchema);

module.exports = ItemInstance;
