import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { SavedContent } from '@modules/contents/save_contents/save-content.entity';
import { UserEntity } from '@modules/user/entity/user.entity';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { UserPreferencesEntity } from '@modules/user-preferences/entity/user-preferences.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'moodmate_test',
  entities: [
    ContentEntity,
    SavedContent,
    UserEntity,
    MoodEntity,
    UserPreferencesEntity,
  ],
  synchronize: true,
  dropSchema: true,
};
