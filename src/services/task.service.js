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
const createUserTask = async (taskBody, userId) => {
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
const updateUserTaskById = async (taskBody, taskId, userId) => {
  const task = await getUserTaskById(taskId, userId);

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
const getUserTaskById = async (taskId, userId) => {
  return Task.findOne({
    _id: taskId,
    _userId: userId,
  });
};

/**
 *
 * @param {mongoose.Types.ObjectId} userId task creator id
 * @param {TASK_TYPE} [taskType]  task type to filter by
 * @returns {Promise<TaskDocument[]>}
 */
const getUserTasks = async (userId, taskType) => {
  const searchQuery = { _userId: userId };

  if (taskType) {
    searchQuery['type'] = taskType;
  }
  return await Task.find(searchQuery);
};

// Todo: Have separate Delete Task method; this method will be used to queue the task for deletion

module.exports = {
  createUserTask,
  updateUserTaskById,
  getUserTaskById,
  getUserTasks,
};
