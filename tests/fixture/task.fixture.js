const { TASK_TYPE, TASK_STATUS, TASK_DIFFICULTY, TASK_FREQUENCY } = require('../../src/constants');
const { Task } = require('../../src/models');
const { testUser } = require('./user.fixture');

const taskUserDailies = {
  _id: '496e95c9087e0ff23d63a411',
  name: 'Task Dailies User 1',
  description: 'Description for Task User 1',
  type: TASK_TYPE.DAILIES,
  status: TASK_STATUS.ACTIVE,
  difficulty: TASK_DIFFICULTY.MEDIUM,
  frequency: TASK_FREQUENCY.DAILY,
  _userId: testUser._id,
};

const taskUserDailiesError = {
  _id: '496e95c9083e0ff23d63a411',
  name: 'Task User 1',
  description: 'Description for Task User 1',
  type: TASK_TYPE.DAILIES,
  status: TASK_STATUS.ACTIVE,
  difficulty: TASK_DIFFICULTY.MEDIUM,
  _userId: testUser._id,
};

const taskUserTodo = {
  _id: '496e95c90ace0ff23d63a411',
  name: 'Task User 1',
  description: 'Description for Task User 1',
  type: TASK_TYPE.TODO,
  status: TASK_STATUS.ACTIVE,
  difficulty: TASK_DIFFICULTY.MEDIUM,
  deadlineDate: new Date('2021-12-31'),
  _userId: testUser._id,
};

const taskUserTodoError = {
  _id: '496e95c90ace0fd23d63a41a',
  name: 'Task User 1',
  description: 'Description for Task User 1',
  type: TASK_TYPE.TODO,
  status: TASK_STATUS.ACTIVE,
  difficulty: TASK_DIFFICULTY.MEDIUM,
  deadlineDate: new Date('2021-12-31'),
  _userId: testUser._id,
};

const insertTasks = async (users) => {
  await Task.insertMany(users);
};

module.exports = {
  insertTasks,
  taskUserDailies,
  taskUserDailiesError,
  taskUserTodo,
  taskUserTodoError,
};
