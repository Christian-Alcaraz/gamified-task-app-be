const mongoose = require('mongoose');
const { TASK_TYPES, TASK_STATUS, TASK_STATUSES, TASK_DIFFICULTIES, TASK_FREQUENCIES } = require('../constants');

const taskSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
