const calculateXPToNextLevel = (currentLevel) => {
  if (currentLevel === 1) {
    return GAME.BASE_XP;
  }

  const toNextLevel = Math.floor(GAME.BASE_XP * currentLevel ** GAME.NEXT_LEVEL_SCALING_FACTOR);
  return toNextLevel;
};

const getRemainingXp = (currentLevel, currentExperience) => {
  const nextLevelExperienceRequirement = calculateXPToNextLevel(currentLevel);
  const remainingExperience = nextLevelExperienceRequirement - Math.floor(currentExperience);

  return remainingExperience;
};

module.exports = {
  calculateXPToNextLevel,
  getRemainingXp,
};
