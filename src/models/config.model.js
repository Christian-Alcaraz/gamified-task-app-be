const mongoose = require('mongoose');

/**
 * @typedef {Object} Config
 * @property {string} name
 * @property {Object} data
 */

/** @typedef {mongoose.Document<mongoose.Types.ObjectId, {}, Config> & Config} ConfigDocument */

/** @type {mongoose.Schema<Config>} */
const configSchema = mongoose.Schema(
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
