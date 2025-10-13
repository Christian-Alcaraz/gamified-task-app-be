const GAME_CORE = require('../../../src/utils/gameCore');
const GAME = require('../../../src/constants/game.constant');

describe('Game Core Utility Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateXPToNextLevel()', () => {
    it('should return result = 100 (BASE_XP) if level is 1', () => {
      const userLevel = 1;
      const result = GAME_CORE.calculateXPToNextLevel(userLevel);
      expect(result).toBe(GAME.BASE_XP);
    });

    it('should return result = Math.floor(BASE_XP * level ** NEXT_LEVEL_SCALING_FACTOR) if level is 2', () => {
      const userLevel = 2;
      const result = GAME_CORE.calculateXPToNextLevel(2);
      expect(result).toBe(Math.floor(GAME.BASE_XP * userLevel ** GAME.NEXT_LEVEL_SCALING_FACTOR));
    });
  });

  describe('getRemainingXp()', () => {
    it('should return result = 100 if level is 1 and has no current experience', () => {
      const result = GAME_CORE.getRemainingXp(1, 0);
      expect(result).toBe(GAME.BASE_XP);
    });

    it('should return result = 95 if level is 1 and current experience is 5', () => {
      const result = GAME_CORE.getRemainingXp(1, 5);
      expect(result).toBe(95);
    });
  });

  describe('calculateTaskReward()', () => {
    it('should return result', () => {
      const task = {
        difficulty: 'easy',
        type: 'dailies',
        streak: 1,
      };

      const result = GAME_CORE.calculateTaskReward(task);
      expect(result).toEqual({ gold: 6, experience: 12 });
    });
  });
});
