// @ts-check
const { Task } = require('../models');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const { TASK_TYPE, TASK_STATUS } = require('../constants');
const { Types } = require('mongoose');

/**
 * @typedef {import('../models/task.model').Task} Task
 */

/**
 *
 * @param {Partial<Task>} taskBody
 * @param {Types.ObjectId} userId
 * @returns {Promise<Task>}
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
 * @param {Partial<Task>} taskBody
 * @param {Types.ObjectId} taskId
 * @param {Types.ObjectId} userId
 * @returns {Promise<Task>}
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
 * @param {Types.ObjectId} taskId
 * @param {Types.ObjectId} userId
 * @returns {Promise<>}
 */
const getUserTaskById = async (taskId, userId) => {
  return Task.findOne({
    _id: taskId,
    _userId: userId,
  });
};

/**
 *
 * @param {Types.ObjectId} userId
 * @param {TASK_TYPE | null} type
 * @returns {Promise<Task[]>}
 */
const getUserTasks = async (userId, type) => {
  const searchQuery = { _userId: userId };

  if (type) {
    searchQuery['type'] = type;
  }
  return await Task.find(searchQuery);
};

/**
 * @param {Types.ObjectId} taskId
 * @param {Types.ObjectId} userId
 * @param {TASK_STATUS} status
 * @returns {Promise<Task>}
 */
const patchUserTaskStatusById = async (taskId, userId, status) => {
  const task = await getUserTaskById(taskId, userId);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  task.status = status;
  await task.save();
  return task;
};

// Todo: Have separate Delete Task method; this method will be used to queue the task for deletion

module.exports = {
  createUserTask,
  updateUserTaskById,
  getUserTaskById,
  getUserTasks,
  patchUserTaskStatusById,
};
