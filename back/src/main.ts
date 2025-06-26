import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const port = process.env.PORT ?? 8000;
  const allowedOrigins: string | RegExp[] = '*';

  app.enableCors({
    origin: allowedOrigins,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port, '0.0.0.0');

  console.log(`App is ready and listening on port ${port}`);

  process.on('SIGINT', async () => {
    console.log('Closing server due to SIGINT (Ctrl+C)');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Closing server due to SIGTERM');
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);