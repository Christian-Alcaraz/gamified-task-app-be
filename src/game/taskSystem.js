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

const calculateStreakMultiplier = (currentStreak) => {
  if (currentStreak <= 1) return 1;

  const streakLevel = calculateStreakLevel(currentStreak);
  const streakMultiplier = 1 + (GAME.INTIAL_STREAK_REWARD + GAME.STEP_STREAK_REWARD * (streakLevel - 1));
  return streakMultiplier;
};

const calculateTaskReward = (task) => {
  const { difficulty, type, streak } = task;

  let streakMultiplier = 1;
  const taskRewardMultiplier = GAME.TASK_REWARD_MULTIPLIER[difficulty];

  let goldReward = GAME.BASE_REWARD_GOLD * taskRewardMultiplier;
  let xpReward = GAME.BASE_REWARD_XP * taskRewardMultiplier;

  if (type === TASK.TYPE.DAILIES) {
    streakMultiplier = calculateStreakMultiplier(streak);
  }
  goldReward *= streakMultiplier;
  xpReward *= streakMultiplier;

  return { gold: goldReward, experience: xpReward };
};

module.exports = {
  calculateTaskReward,
};
