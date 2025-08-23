const httpStatus = require('http-status').status;
const { taskService } = require('../services');
const catchAsync = require('../utils/catchAsync');

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

  res.status(httpStatus.OK).send(tasks);
});

module.exports = {
  createTask,
  updateTaskById,
  getTaskById,
  getTasks,
};
