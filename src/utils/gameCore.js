const { TASK_TYPE } = require('../constants');
const GAME = require('../constants/game.constant');

const calculateXPToNextLevel = (currentLevel) => {
  if (currentLevel === 1) {
    return GAME.BASE_XP;
  }

  const toNextLevel = Math.floor(GAME.BASE_XP * currentLevel ** GAME.NEXT_LEVEL_SCALING_FACTOR);
  return toNextLevel;
};

const getRemainingXPForNextLevel = (currentLevel, currentExperience) => {
  const nextLevelExperienceRequirement = calculateXPToNextLevel(currentLevel);
  const remainingExperience = nextLevelExperienceRequirement - Math.floor(currentExperience);

  return remainingExperience;
};

const getLevelMultiplier = (currentLevel) => {
  return 1 + GAME.LEVEL_SCALING_FACTOR * Math.log(currentLevel);
};

/**
   * Guideline
   * Minimum Streak Days: 3 days;
   * 3 days  = 1.25x
   * 10 days = 1.4x
   * 30 days = 1.75x
   * 60+ days = 2x
   
  */
const calculateStreakLevel = (currentStreak) => {
  if (currentStreak >= 60) return 6;

  let streakLevel = 0;
  const daysForMilestone = (streak) => Math.ceil(GAME.BASE_DAYS_STREAK * streak ** GAME.STREAK_SCALING_FACTOR);

  while (currentStreak >= daysForMilestone(streakLevel + 1)) {
    streakLevel++;
  }

  return streakLevel;
};

const calculateDelta = (reward, upDown) => {
  const { gold, xp } = reward;
  const multiplier = upDown === 'up' ? 1 : -1;

  return (gold + xp) * multiplier;
};

const calculateStreakMultiplier = (currentStreak) => {
  if (currentStreak === 0) return 1;

  const streakLevel = calculateStreakLevel(currentStreak);
  const streakMultiplier = 1 + (GAME.INTIAL_STREAK_REWARD + GAME.STEP_STREAK_REWARD * (streakLevel - 1));
  return streakMultiplier;
};

const calculateTaskReward = (userLevel, task) => {
  const { difficulty, type, streak } = task;
  const taskRewardMultiplier = GAME.TASK_REWARD_MULTIPLIER[difficulty];
  const levelMultiplier = getLevelMultiplier(userLevel);

  let goldReward = GAME.BASE_REWARD_GOLD * levelMultiplier * taskRewardMultiplier;
  let xpReward = GAME.BASE_REWARD_XP * levelMultiplier * taskRewardMultiplier;

  if (type === TASK_TYPE.DAILIES) {
    const streakMultiplier = calculateStreakMultiplier(streak);
    goldReward *= streakMultiplier;
    xpReward *= streakMultiplier;
  }

  return { gold: goldReward, experience: Math.floor(xpReward) };
};

module.exports = {
  calculateXPToNextLevel,
  getRemainingXPForNextLevel,
  calculateTaskReward,
  calculateDelta,
};
