//@ts-check
const mongoose = require('mongoose');
const { TASK_TYPES, TASK_DIFFICULTIES, TASK_FREQUENCIES } = require('../constants');
const toJSONExcludeId = require('./plugins/toJSONExcludeId');

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} type
 * @property {boolean} completed
 * @property {number} streak
 * @property {string} [difficulty]
 * @property {string} [frequency]
 * @property {Date} [deadlineDate]
 * @property {mongoose.Types.ObjectId} _userId
 * @property {object} rewardGranted
 * @property {array} history
 */

/** @typedef {mongoose.Document<mongoose.Types.ObjectId, {}, Task> & Task} TaskDocument */

/** @type {mongoose.Schema<Task>} */
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enums: TASK_TYPES,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    streak: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: TASK_DIFFICULTIES,
    },
    frequency: {
      type: String,
      enum: TASK_FREQUENCIES,
    },
    deadlineDate: {
      type: Date,
    },
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rewardGranted: {
      type: mongoose.Schema.Types.Mixed,
    },
    history: [
      {
        date: {
          type: Number,
          required: true,
        },
        completed: Boolean,
        isDue: Boolean,
        value: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// taskSchema.plugin(toJSONExcludeId);

/** @type {mongoose.Model<Task>} */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
