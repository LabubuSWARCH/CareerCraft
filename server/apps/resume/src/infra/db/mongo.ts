import mongoose from 'mongoose';
import { MONGO_URL } from '../../config';

let connectionPromise: Promise<typeof mongoose> | null = null;

export function connectMongo() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    connectionPromise.catch((err) => {
      connectionPromise = null;
      console.error('Mongo connection error', err);
    });
  }

  return connectionPromise;
}
