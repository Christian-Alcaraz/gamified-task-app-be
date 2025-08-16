const Joi = require('joi');
const { TASK_TYPES, TASK_STATUSES, TASK_DIFFICULTIES, TASK_FREQUENCIES, TASK_TYPE } = require('../constants');
const JoiObjectId = require('./helpers/mongoObjectId');

const TaskBody = {
  name: Joi.string().required().description('Task name'),
  description: Joi.string().allow('', null).description('Task description'),
  type: Joi.string()
    .valid(...TASK_TYPES)
    .required()
    .description('Task type'),
  status: Joi.string().valid(...TASK_STATUSES),
  difficulty: Joi.string().valid(...TASK_DIFFICULTIES),
  frequency: Joi.when('type', {
    is: TASK_TYPE.DAILIES,
    then: Joi.string()
      .valid(...TASK_FREQUENCIES)
      .required()
      .description('Task frequency'),
    otherwise: Joi.forbidden(),
  }),
  deadlineDate: Joi.when('type', {
    is: TASK_TYPE.TODO,
    then: Joi.date().allow('', null).description('Task deadline date'),
    otherwise: Joi.forbidden(),
  }),
};

const validation = {
  createUserTask: {
    body: Joi.object().keys(TaskBody),
  },
  updateUserTaskById: {
    params: Joi.object().keys({
      taskId: JoiObjectId().required().description('Task ID'),
    }),
    body: Joi.object().keys(TaskBody),
  },
  patchUserTaskStatusById: {
    params: Joi.object().keys({
      taskId: JoiObjectId().required().description('Task ID'),
    }),
    body: Joi.object().keys({
      status: Joi.string()
        .valid(...TASK_STATUSES)
        .required()
        .description('Task status'),
    }),
  },
  getUserTaskById: {
    params: Joi.object().keys({
      taskId: JoiObjectId().required().description('Task ID'),
    }),
  },
  getUserTasks: {
    query: Joi.object().keys({
      type: Joi.string()
        .valid(...TASK_TYPES)
        .description('Task type'),
    }),
  },
};

module.exports = validation;
