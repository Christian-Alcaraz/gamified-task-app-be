const authController = require('./auth.controller');
const userController = require('./user.controller');
const userCharacterController = require('./userCharacter.controller');
const taskController = require('./task.controller');
const configController = require('./config.controller');

module.exports = {
  authController,
  userController,
  taskController,
  userCharacterController,
  configController,
};
