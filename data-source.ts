import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from 'src/users/entities/user.entity';

dotenv.config(); // Загружаем переменные окружения

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: ['dist/src/migrations/*.js'],
  entities: [UserEntity],
  logging: true,
});
