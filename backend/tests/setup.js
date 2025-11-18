import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  process.env.JWT_EXPIRES_IN = '7d';
  process.env.EMAIL_USER = 'test@dreamnex.com';
  process.env.EMAIL_PASS = 'password';
  process.env.GOOGLE_CLIENT_ID = 'test_google_client';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany()));
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

