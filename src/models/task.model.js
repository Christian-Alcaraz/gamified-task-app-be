//@ts-check
const mongoose = require('mongoose');
const {
  TASK_TYPES,
  TASK_TYPE,
  TASK_STATUS,
  TASK_STATUSES,
  TASK_DIFFICULTY,
  TASK_DIFFICULTIES,
  TASK_FREQUENCY,
  TASK_FREQUENCIES,
} = require('../constants');

/**
 * @typedef {Object} Task
 * @property {string} name
 * @property {string} [description]
 * @property {TASK_TYPE} type
 * @property {TASK_STATUS} [status]
 * @property {TASK_DIFFICULTY} [difficulty]
 * @property {TASK_FREQUENCY} [frequency]
 * @property {Date} [deadlineDate]
 * @property {mongoose.Types.ObjectId} _userId
 */

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
    status: {
      type: String,
      default: TASK_STATUS.ACTIVE,
      enum: TASK_STATUSES,
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
  },
  {
    timestamps: true,
  },
);

/** @type {mongoose.Model<Task>} */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
