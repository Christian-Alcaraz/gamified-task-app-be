const sex = require('./sex.constant');
const status = require('./status.constant');
const tokenType = require('./tokenType.constant');
const userType = require('./userType.constant');
const config = require('./config.constant');
const stat = require('./stats.constant');
const socket = require('./socket.constant');

const GAME = require('./game.constant');
const TASK = require('./task.constant');
const CHARACTER = require('./character.constant');
const ITEM = require('./item.constant');
const ENVIRONMENT = require('./environment.constant');

module.exports = {
  ...sex,
  ...status,
  ...stat,
  ...tokenType,
  ...userType,
  ...config,
  ...socket,
  TASK,
  GAME,
  CHARACTER,
  ITEM,
  ENVIRONMENT,
};
