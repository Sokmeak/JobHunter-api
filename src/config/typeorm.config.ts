import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { databaseConfig } from './database.config';

dotenv.config();

const AppDataSource = new DataSource(databaseConfig);

export default AppDataSource;

