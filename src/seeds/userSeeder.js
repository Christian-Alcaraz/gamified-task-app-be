const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../config/logger');
const { USER_TYPE } = require('../constants');
const User = require('../models/user.model');
const Conversation = require('../models/conversation.model');

const seedSuperAdmin = async () => {
  logger.info('[Seeder]:: Seeding Super Admin...');
  const superAdminId = mongoose.Types.ObjectId.createFromHexString(config.adminCredentials.id);
  const superAdminExists = await User.findById(superAdminId);

  if (!superAdminExists) {
    const superAdmin = {
      _id: superAdminId,
      firstName: 'Super',
      lastName: 'Admin',
      email: config.adminCredentials.email,
      password: config.adminCredentials.password,
      type: USER_TYPE.ADMIN,
    };

    await User.create(superAdmin);
    logger.info('[Seeder]:: Super Admin seeded.');
  } else {
    logger.info('[Seeder]:: Super Admin already exists.');
  }

  if (config.env === 'dev') {
    const testReceipientId = mongoose.Types.ObjectId.createFromHexString(config.testReceipient.id);
    const testReceipientExists = await User.findById(testReceipientId);

    if (!testReceipientExists) {
      const testReceipientCharacter = {
        name: 'Test Receipient',
      };
      const testReceipient = {
        _id: testReceipientId,
        firstName: 'Test',
        lastName: 'Receipient',
        email: config.testReceipient.email,
        password: config.testReceipient.password,
        type: USER_TYPE.USER,
      };
      await User.create(testReceipient);
      logger.info('[Seeder]:: Test Receipient seeded.');
    } else {
      logger.info('[Seeder]:: Test Receipient already exists.');
    }

    const testConversationId = mongoose.Types.ObjectId.createFromHexString(config.testConversation.id);
    const testConvoExists = await Conversation.findById(config.testConversation.id);

    if (!testConvoExists) {
      const testConversation = {
        _id: testConversationId,
        participants: [
          {
            name: 'Test Admin',
            userId: config.adminCredentials.id,
          },
          {
            name: 'Test Receipient',
            userId: config.testReceipient.id,
          },
        ],
        type: 'private',
        createdBy: {
          name: 'Test Admin',
          userId: config.adminCredentials.id,
        },
        name: config.testConversation.name,
        isGroupChat: false,
      };
      await Conversation.create(testConversation);
      logger.info('[Seeder]:: Test Conversation with Test Admin and Test Receipient seeded.');
    } else {
      logger.info('[Seeder]:: Test Conversation already exists.');
    }
  }
};

module.exports = { seedSuperAdmin };
