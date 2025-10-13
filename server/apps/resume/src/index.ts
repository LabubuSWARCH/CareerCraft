import { startRestServer } from './infra/rest';

async function bootstrap() {
  try {
    await startRestServer();
  } catch (err) {
    console.error('Failed to start resume service', err);
    process.exit(1);
  }
}

bootstrap();
