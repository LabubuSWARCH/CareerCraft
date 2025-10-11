import mongoose from 'mongoose';
import { MONGO_URL } from '../../config';

mongoose.set('strictQuery', false);

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2) return mongoose.connection;

  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection failed', err);
    throw err;
  }
}
