import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@dreamnex.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      await User.create({
        name: 'DreamNex Admin',
        email: adminEmail,
        password: process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!',
        role: 'admin',
        emailVerified: true,
      });
      console.log(`Admin user created (${adminEmail})`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Seed failed', error);
    process.exit(1);
  }
};

seed();

