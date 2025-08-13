// Frequency
const TASK_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};
const TASK_FREQUENCIES = Object.values(TASK_FREQUENCY);

// Difficulty
const TASK_DIFFICULTY = {
  TRIVIAL: 'trivial',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};
const TASK_DIFFICULTIES = Object.values(TASK_DIFFICULTY);

// Status
const TASK_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  PAUSED: 'paused',
};
const TASK_STATUSES = Object.values(TASK_STATUS);

// Type
const TASK_TYPE = {
  DAILIES: 'dailies',
  TODO: 'todo',
};
const TASK_TYPES = Object.values(TASK_TYPE);

module.exports = {
  TASK_FREQUENCY,
  TASK_FREQUENCIES,
  TASK_DIFFICULTY,
  TASK_DIFFICULTIES,
  TASK_STATUS,
  TASK_STATUSES,
  TASK_TYPE,
  TASK_TYPES,
};
