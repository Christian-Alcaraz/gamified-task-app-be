const httpStatus = require('http-status').status;
const { taskService, userCharacterService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { Task } = require('../models');
const GAME_CORE = require('../utils/gameCore');

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
  if (scoreState !== 'up') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bad request url connection');
  }

  const user = req.user;
  const userId = user._id;
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (task.rewardGranted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already rewarded for the task');
  }

  const reward = GAME_CORE.calculateTaskReward(user.stats.level, task);
  const updatedUser = await userCharacterService.putGrantUserTaskRewards(user, task, reward);
  await taskService.putTaskCompletedStateById(taskId, userId, scoreState, reward);

  res.status(httpStatus.OK).send(updatedUser);
});

const putRevokeUserTaskRewards = catchAsync(async (req, res, next) => {
  if (!req.user.stats || !req.user.character) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User has not created a character');
  }

  const scoreState = req.url.split('/').pop();
  if (scoreState !== 'down') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bad request url connection');
  }

  const user = req.user;
  const userId = user._id;
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (!task.rewardGranted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Task has not rewarded');
  }

  const updatedUser = await userCharacterService.putRevokeUserTaskRewards(user, task);
  await taskService.putTaskCompletedStateById(taskId, userId, scoreState);

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
