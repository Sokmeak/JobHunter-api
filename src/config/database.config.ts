import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// dotenv.config({ path: '.env' });
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });
export const databaseConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'postgres',
  host: String(process.env.DB_HOST), // e.g., 'localhost'
  port: parseInt(String(process.env.DB_PORT) || '5434', 10), // e.g., 5432 or 5434
  username: String(process.env.DB_USERNAME), // e.g., 'postgres'
  password: String(process.env.DB_PASSWORD), // e.g., 'yourpassword'
  database: String(process.env.DB_NAME), // e.g., 'mydatabase'
  entities: [__dirname + '/../**/*.entity.{ts,js}'], // Correct for NestJS structure
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'], // Good
  synchronize: true, // Set to false in production
  migrationsRun: false,
  autoLoadEntities: true, // Handy for NestJS
};
