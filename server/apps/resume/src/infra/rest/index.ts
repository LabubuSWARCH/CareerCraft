import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import resumeRoutes from './routes/resumes';
import { FRONTEND_URL, REST_PORT } from '../../config';
import { connectMongo } from '../db/mongo';

export async function startRestServer() {
  await connectMongo();

  const app = express();

  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use('/resumes', resumeRoutes);

  app.use(
    (err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err);
      if (res.headersSent) {
        return next(err);
      }
      res.status(500).json({ error: 'Internal server error' });
    },
  );

  app.listen(REST_PORT, () => {
    console.log(`Resume REST server running on http://localhost:${REST_PORT}`);
  });
}
