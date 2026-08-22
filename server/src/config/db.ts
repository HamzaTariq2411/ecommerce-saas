import mongoose from 'mongoose';
import { env } from '@/config/env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});