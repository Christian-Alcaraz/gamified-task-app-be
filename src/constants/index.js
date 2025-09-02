const sex = require('./sex.constant');
const status = require('./status.constant');
const tokenType = require('./tokenType.constant');
const userType = require('./userType.constant');
const config = require('./config.constant');

const GAME = require('./game.constant');
const taskConstants = require('./task.constant');
const CHARACTER = require('./character.constant');
module.exports = {
  ...sex,
  ...status,
  ...tokenType,
  ...userType,
  ...config,
  ...taskConstants, // Todo: make this to TASK; so TASK.TYPE TASK.DIFFICULTY
  GAME,
  CHARACTER,
};
