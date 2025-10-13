const { STAT } = require('./stats.constant');

const ATTRIBUTE = {
  STACKABLE: 'stackable',
  CRAFTABLE: 'craftable',
  ENCHANTABLE: 'enchantable',
  TRADABLE: 'tradeable',
  EQUIPPABLE: 'equippable',
  REPAIRABLE: 'repairable',
  SOCKETS: 'sockets',
};

const USAGE_ATTRIBUTE = {
  CONSUME_ON_USE: 'consumeOnUse',
  COOLDOWN_DURATION: 'cooldownDuration',
  EFFECT_DURATION: 'effectDuration',
};

const RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

const CONSUMABLE_BASE_STAT = {
  ADD_HEALTH: 'add_health',
  ADD_MANA: 'add_mana',
  ADD_EXPERIENCE: 'add_experience',
  BONUS_STRENGTH: 'bonus_strength',
  BONUS_DEXTERITY: 'bonus_dexterity',
  BONUS_INTELLIGENCE: 'bonus_intelligence',
  BONUS_CONSTITUTION: 'bonus_constitution',
};

const EQUIPMENT_BASE_STAT = {
  CRITICAL_CHANCE: 'critical_chance',
  CRITICAL_DAMAGE: 'critical_damage',
  PHYSICAL_RESISTANCE: 'physical_resistance',
  MAGIC_RESISTANCE: 'magic_resistance',
  LIFESTEAL: 'lifesteal',
};

const BASE_STAT = {
  STRENGTH: STAT.STRENGTH,
  DEXTERITY: STAT.DEXTERITY,
  INTELLIGENCE: STAT.INTELLIGENCE,
  CONSTITUTION: STAT.CONSTITUTION,
};

const TYPE = {
  MAIN_HAND: 'mainhand',
  OFF_HAND: 'offhand',
  HELMET: 'helmet',
  BODY: 'body',
  LEGS: 'legs',
  HANDS: 'hands',
  CONSUMABLE: 'consumable',
  RING: 'ring',
  AMULET: 'amulet',
  NECKLACE: 'necklace',
  BRACELET: 'bracelet',
};

const TYPE_INDEX = {
  mainhand: 1,
  offhand: 2,
  helmet: 3,
  body: 4,
  legs: 5,
  hands: 6,
  consumable: 7,
  ring: 8,
  amulet: 9,
  necklace: 10,
};

const SOURCE = {
  DROP: 'drop',
  CRAFT: 'craft',
  SHOP: 'shop',
  REWARD: 'reward',
};

const ATTRIBUTES = Object.values(ATTRIBUTE);
const USAGE_ATTRIBUTES = Object.values(USAGE_ATTRIBUTE);
const SOURCES = Object.values(SOURCE);
const TYPES = Object.values(TYPE);
const RARITIES = Object.values(RARITY);
const BASE_STATS = Object.values(BASE_STAT);
const CONSUMABLE_BASE_STATS = Object.values(CONSUMABLE_BASE_STAT);
const EQUIPMENT_BASE_STATS = Object.values(EQUIPMENT_BASE_STAT);
const ALL_BASE_STATS = [...BASE_STATS, ...CONSUMABLE_BASE_STATS, ...EQUIPMENT_BASE_STATS];

module.exports = {
  ATTRIBUTE,
  ATTRIBUTES,
  USAGE_ATTRIBUTE,
  USAGE_ATTRIBUTES,
  SOURCE,
  SOURCES,
  TYPE,
  TYPE_INDEX,
  TYPES,
  ALL_BASE_STATS,
  BASE_STAT,
  BASE_STATS,
  CONSUMABLE_BASE_STAT,
  CONSUMABLE_BASE_STATS,
  EQUIPMENT_BASE_STAT,
  EQUIPMENT_BASE_STATS,
  RARITY,
  RARITIES,
};
