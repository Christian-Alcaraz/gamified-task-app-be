const httpStatus = require('http-status').status;
const { taskService, userCharacterService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const createTask = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskBody = req.body;

  const task = await taskService.createTask(taskBody, userId);

  res.status(httpStatus.CREATED).send(task);
});

const updateTaskById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;
  const taskBody = req.body;

  const task = await taskService.updateTaskById(taskBody, taskId, userId);

  res.status(httpStatus.OK).send(task);
});

const getTaskById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const task = await taskService.getTaskById(taskId, userId);
  res.status(httpStatus.OK).send(task);
});

const getTasks = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const query = req.query;
  const tasks = await taskService.getTasks(userId, query);

  // const toJSONTasks = tasks.map((task) => task);
  res.status(httpStatus.OK).send(tasks);
});

const putGrantUserTaskRewards = catchAsync(async (req, res, next) => {
  if (!req.user.stats || !req.user.character) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User has not created a character');
  }

  const scoreState = req.url.split('/').pop();
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const task = await taskService.putTaskCompletedStateById(taskId, userId, scoreState);
  const updatedUser = await userCharacterService.putGrantUserTaskRewards(user, task);

  res.status(httpStatus.OK).send(updatedUser);
});

const putRevokeUserTaskRewards = catchAsync(async (req, res, next) => {
  if (!req.user.stats || !req.user.character) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User has not created a character');
  }

  const scoreState = req.url.split('/').pop();
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const task = await taskService.putTaskCompletedStateById(taskId, userId, scoreState);
  const updatedUser = await userCharacterService.putRevokeUserTaskRewards(user, task);

  res.status(httpStatus.OK).send(updatedUser);
});

module.exports = {
  createTask,
  updateTaskById,
  getTaskById,
  getTasks,
  putGrantUserTaskRewards,
  putRevokeUserTaskRewards,
};
