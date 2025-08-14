const Joi = require('joi');
const { TASK_TYPES, TASK_STATUSES, TASK_DIFFICULTIES, TASK_FREQUENCIES } = require('../constants');
const JoiObjectId = require('./helpers/mongoObjectId');

const TaskBody = {
  name: Joi.string().required(),
  description: Joi.string(),
  type: Joi.string()
    .valid(...TASK_TYPES)
    .required(),
  status: Joi.string().valid(...TASK_STATUSES),
  difficulty: Joi.string().valid(...TASK_DIFFICULTIES),
  frequency: Joi.string().valid(...TASK_FREQUENCIES),
  deadlineDate: Joi.date(),
};

const validation = {
  createUserTask: {
    body: Joi.object().keys(TaskBody),
  },
  updateUserTaskById: {
    params: Joi.object().keys({
      taskId: JoiObjectId().required(),
    }),
    body: Joi.object().keys(TaskBody),
  },
  patchUserTaskStatusById: {
    params: Joi.object().keys({
      taskId: JoiObjectId().required(),
    }),
    query: Joi.object().keys({
      status: Joi.string()
        .valid(...TASK_STATUSES)
        .required(),
    }),
  },
  getUserTaskById: {
    params: Joi.object().keys({
      taskId: JoiObjectId().required(),
    }),
  },
  getUserTasks: {
    query: Joi.object().keys({
      type: Joi.string().valid(...TASK_TYPES),
    }),
  },
};

module.exports = validation;
