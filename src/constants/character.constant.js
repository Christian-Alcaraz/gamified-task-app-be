const STAT_CONST = require('./stats.constant');

const CLASS = {
  WARRIOR: 'warrior',
  ARCHER: 'archer',
  MAGE: 'mage',
  ASSASSIN: 'assassin',
};

const CLASSES = Object.values(CLASS);

const STAT = {
  ...STAT_CONST.STAT,
  LEVEL: 'level',
  STAT_POINTS: 'statPoints',
  TO_NEXT_LEVEL: 'toNextLevel',
};

const STATS = Object.values(STAT);

module.exports = { CLASS, CLASSES, STATS, STAT };
