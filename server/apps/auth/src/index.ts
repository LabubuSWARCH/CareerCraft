import { startRestServer } from './infra/rest';
import { startGrpcServer } from './infra/grpc';

async function bootstrap() {
  try {
    startRestServer();
    startGrpcServer();
  } catch (err) {
    console.error('Failed to start service:', err);
    process.exit(1);
  }
}

bootstrap();
