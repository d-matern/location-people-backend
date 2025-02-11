import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { LocationModule } from './location/location.module';
import { UsersModule } from './users/users.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrations: ['dist/src/migrations/*.js'],
      entities: [User],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    LocationModule,
    WebSocketModule,
  ],
})
export class AppModule {}
