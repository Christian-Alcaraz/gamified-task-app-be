const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const setupTestDB = () => {
  let mongod;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    return Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterEach(async () => {
    return Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    await mongod.stop();
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
