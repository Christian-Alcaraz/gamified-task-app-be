const CLASS = {
  WARRIOR: 'warrior',
  ARCHER: 'archer',
  MAGE: 'mage',
  ASSASSIN: 'assassin',
};

const CLASSES = Object.values(CLASS);

const STAT = {
  HEALTH: 'health',
  MANA: 'mana',
  STRENGTH: 'strength',
  DEXTERITY: 'dexterity',
  INTELLIGENCE: 'intelligence',
  CONSTITUTION: 'constitution',
  EXPERIENCE: 'experience',
  LEVEL: 'level',
  STAT_POINTS: 'statPoints',
  TO_NEXT_LEVEL: 'toNextLevel',
};

const STATS = Object.values(STAT);

module.exports = { CLASS, CLASSES, STATS, STAT };
