import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3002);

  console.log(`Server is running on port ${process.env.PORT ?? 3002}`);
}
bootstrap();
