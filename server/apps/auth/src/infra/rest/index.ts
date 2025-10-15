import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import { REST_PORT, FRONTEND_URL } from '../../config';
import cors from 'cors';

export function startRestServer() {
  const app = express();
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb' }));
  app.use(cookieParser());
  app.use('/auth', authRoutes);

  app.listen(REST_PORT, () => console.log(`REST server running on http://localhost:${REST_PORT}`));
}
