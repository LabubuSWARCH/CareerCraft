import dotenv from 'dotenv';

dotenv.config();

export const REST_PORT = process.env.REST_PORT || 8080;
export const GRPC_PORT = process.env.GRPC_PORT || 50051;

export const SQL_URL = process.env.SQL_URL || 'postgresql://user:pass@localhost:5432/main';
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:pass@localhost:5672';
export const ADMIN_REGISTRATION_PASSWORD = process.env.ADMIN_REGISTRATION_PASSWORD;
