import { startRestServer } from './infra/rest';

async function bootstrap() {
  try {
    await startRestServer();
  } catch (err) {
    console.error('Failed to start template service', err);
    process.exit(1);
  }
}

bootstrap();
