import express from 'express';
import cors from 'cors';
import templateRoutes from './routes/templates';
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

  app.use(express.json());
  app.use('/templates', templateRoutes);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(REST_PORT, () => {
    console.log(`Template REST server running on http://localhost:${REST_PORT}`);
  });
}
