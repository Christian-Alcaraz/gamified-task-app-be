const authService = require('./auth.service');
const tokenService = require('./token.service');
const userService = require('./user.service');
const userCharacterService = require('./userCharacter.service');
const taskService = require('./task.service');
const configService = require('./config.service');
const itemService = require('./item.service');

module.exports = {
  authService,
  tokenService,
  userService,
  userCharacterService,
  taskService,
  configService,
  itemService,
};
