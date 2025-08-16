const httpStatus = require('http-status').status;
const { taskService } = require('../services');
const catchAsync = require('../utils/catchAsync');

//Todo: Task Controller Methods
const createUserTask = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskBody = req.body;

  const task = await taskService.createUserTask(taskBody, userId);

  res.status(httpStatus.CREATED).send(task);
});

const updateUserTaskById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;
  const taskBody = req.body;

  const task = await taskService.updateUserTaskById(taskBody, taskId, userId);

  res.status(httpStatus.OK).send(task);
});

const patchUserTaskStatusById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;
  const status = req.body.status;

  const task = await taskService.patchUserTaskStatusById(taskId, userId, status);
  res.status(httpStatus.OK).send(task);
});

const getUserTaskById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const task = await taskService.getUserTaskById(taskId, userId);
  res.status(httpStatus.OK).send(task);
});

const getUserTasks = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskType = req.query.type ?? null;
  const tasks = await taskService.getUserTasks(userId, taskType);

  res.status(httpStatus.OK).send(tasks);
});

module.exports = {
  createUserTask,
  updateUserTaskById,
  patchUserTaskStatusById,
  getUserTaskById,
  getUserTasks,
};
