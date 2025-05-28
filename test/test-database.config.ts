import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ContentEntity } from '@modules/contents/model/content.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'moodmate_test',
  entities: [ContentEntity],
  synchronize: true,
  dropSchema: true,
};
