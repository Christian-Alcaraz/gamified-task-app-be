const { seedSuperAdmin } = require('./userSeeder');
const logger = require('../config/logger');

const seed = async () => {
  logger.info('[Seeder]:: Seeding data...');
  await seedSuperAdmin();
  logger.info('[Seeder]:: Seeding completed.');
};

module.exports = seed;
