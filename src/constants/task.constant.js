// Frequency
const FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};
const FREQUENCIES = Object.values(FREQUENCY);

// Difficulty
const DIFFICULTY = {
  TRIVIAL: 'trivial',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};
const DIFFICULTIES = Object.values(DIFFICULTY);

// Status
const STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  PAUSED: 'paused',
};

const STATUSES = Object.values(STATUS);

// Type
const TYPE = {
  DAILIES: 'dailies',
  TODO: 'todo',
};
const TYPES = Object.values(TYPE);

module.exports = {
  FREQUENCY,
  FREQUENCIES,
  DIFFICULTY,
  DIFFICULTIES,
  STATUS,
  STATUSES,
  TYPE,
  TYPES,
};
