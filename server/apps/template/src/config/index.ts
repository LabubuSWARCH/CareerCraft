import dotenv from 'dotenv';

dotenv.config();

export const REST_PORT = process.env.REST_PORT || 8081;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const MONGO_URL =
  process.env.MONGO_URL || 'mongodb://localhost:27017/careercraft_templates';
export const AUTH_GRPC_URL = process.env.AUTH_GRPC_URL || 'localhost:50051';

export const NODE_ENV = process.env.NODE_ENV || 'development';
