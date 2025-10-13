const { TASK } = require('../../src/constants');
const { Task } = require('../../src/models');
const { testUser } = require('./user.fixture');

const taskUserDailies = {
  _id: '496e95c9087e0ff23d63a411',
  name: 'Task Dailies User 1',
  description: 'Description for Task User 1',
  type: TASK.TYPE.DAILIES,
  status: TASK.STATUS.ACTIVE,
  difficulty: TASK.DIFFICULTY.MEDIUM,
  frequency: TASK.FREQUENCY.DAILY,
  _userId: testUser._id,
};

const taskUserDailiesError = {
  _id: '496e95c9083e0ff23d63a411',
  name: 'Task User 1',
  description: 'Description for Task User 1',
  type: TASK.TYPE.DAILIES,
  status: TASK.STATUS.ACTIVE,
  difficulty: TASK.DIFFICULTY.MEDIUM,
  _userId: testUser._id,
};

const taskUserTodo = {
  _id: '496e95c90ace0ff23d63a411',
  name: 'Task User 1',
  description: 'Description for Task User 1',
  type: TASK.TYPE.TODO,
  status: TASK.STATUS.ACTIVE,
  difficulty: TASK.DIFFICULTY.MEDIUM,
  deadlineDate: new Date('2021-12-31'),
  _userId: testUser._id,
};

const taskUserTodoError = {
  _id: '496e95c90ace0fd23d63a41a',
  name: 'Task User 1',
  description: 'Description for Task User 1',
  type: TASK.TYPE.TODO,
  status: TASK.STATUS.ACTIVE,
  difficulty: TASK.DIFFICULTY.MEDIUM,
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
