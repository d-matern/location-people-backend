import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN });
  app.useWebSocketAdapter(new IoAdapter(app));

  const server = app.getHttpServer();
  server.on('connection', (socket: Socket) => {
    socket.on('connection', () => {
      socket.emit('connected', 'Hello, WebSocket');
    });
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
