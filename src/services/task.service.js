// @ts-check
const { Task } = require('../models');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { TASK_TYPE, TASK_STATUS } = require('../constants');
const mongoose = require('mongoose');

/** @typedef {import('../models/task.model').TaskDocument} TaskDocument */
/** @typedef {import('../models/task.model').Task} Task */

/**
 *
 * @param {Partial<Task>} taskBody task document body
 * @param {mongoose.Types.ObjectId} userId task creator id
 * @returns {Promise<TaskDocument>}
 */
const createTask = async (taskBody, userId) => {
  const body = {
    ...taskBody,
  };

  body['_userId'] = userId;
  const task = await Task.create(body);
  return task;
};

/**
 *
 * @param {Partial<Task>} taskBody task new document body
 * @param {mongoose.Types.ObjectId} taskId task document id
 * @param {mongoose.Types.ObjectId} userId task creator id
 * @returns {Promise<TaskDocument>}
 */
const updateTaskById = async (taskBody, taskId, userId) => {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  Object.assign(task, taskBody);
  await task.save();
  return task;
};

/**
 *
 * @param {mongoose.Types.ObjectId} taskId task document id
 * @param {mongoose.Types.ObjectId} userId task creator id
 * @returns {Promise<TaskDocument>}
 */
const getTaskById = async (taskId, userId) => {
  return Task.findOne({
    _id: taskId,
    _userId: userId,
  });
};

/**
 *
 * @param {mongoose.Types.ObjectId} userId task creator id
 * @param {Object} [query]  task type to filter by
 * @returns {Promise<TaskDocument[]>}
 */
const getTasks = async (userId, query) => {
  const { type, completed, deadlineDate } = query;

  if (type && type === TASK_TYPE.DAILIES && deadlineDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Deadline date is forbidden for Dailies tasks');
  }

  const searchQuery = { _userId: userId };

  if (type) {
    searchQuery['type'] = type;
  }

  if (typeof completed === 'boolean') {
    searchQuery['completed'] = completed;
  }

  if (deadlineDate === 'exists') {
    searchQuery['deadlineDate'] = { $exists: true, $ne: null };
  }

  return await Task.find(searchQuery);
};

// Todo: Have separate Delete Task method; this method will be used to queue the task for deletion

module.exports = {
  createTask,
  updateTaskById,
  getTaskById,
  getTasks,
};
