import { NestFactory } from '@nestjs/core';
import { EventServerModule } from './event-server.module';

async function bootstrap() {
  const app = await NestFactory.create(EventServerModule);

  app.setGlobalPrefix('event');
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
