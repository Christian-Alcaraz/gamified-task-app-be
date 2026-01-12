const mongoose = require('mongoose');

/**
 * @typedef {Object} Config
 * @property {mongoose.Types.ObjectId} [_id]
 * @property {string} name
 * @property {Object} data
 */

/** @typedef {mongoose.Document & Config} ConfigDocument */

/** @type {mongoose.Schema<Config>} */
const configSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<Config>} */
const Config = mongoose.model('Config', configSchema);

module.exports = Config;
