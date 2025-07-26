const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user.model');
const logger = require('../config/logger');
const { USER_TYPE } = require('../constants');

const seedSuperAdmin = async () => {
  logger.info('[Seeder]:: Seeding Super Admin...');
  const superAdminId = mongoose.Types.ObjectId.createFromHexString(config.adminCredentials.id);
  const hasSuperAdmin = await User.findById(superAdminId);
  if (hasSuperAdmin) {
    logger.info('[Seeder]:: Super Admin already exists.');
    return;
  }

  const superAdmin = {
    _id: superAdminId,
    firstName: 'Super',
    lastName: 'Admin',
    email: config.adminCredentials.email,
    password: config.adminCredentials.password,
    userType: USER_TYPE.ADMIN,
    occupation: 'Super Admin',
  };

  superAdmin._tenantId = superAdminId;

  await User.create(superAdmin);

  logger.info('[Seeder]:: Super Admin seeded.');
};

module.exports = { seedSuperAdmin };
