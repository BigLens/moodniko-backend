import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from '@utils/snake_snake';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { SavedContent } from '@modules/contents/save_contents/save-content.entity';
import { UserEntity } from '@modules/user/entity/user.entity';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { UserPreferencesEntity } from '@modules/user-preferences/entity/user-preferences.entity';
import { AppConfigService } from '../config/config.service';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export function createDataSource(configService: AppConfigService): DataSource {
  return new DataSource({
    type: configService.databaseType as any,
    host: configService.databaseHost,
    port: configService.databasePort,
    username: configService.databaseUsername,
    password: configService.databasePassword,
    database: configService.databaseName,
    synchronize: configService.databaseSynchronize,
    entities: [
      ContentEntity,
      SavedContent,
      UserEntity,
      MoodEntity,
      UserPreferencesEntity,
    ],
    namingStrategy: new SnakeNamingStrategy(),
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsTableName: configService.databaseMigrationsTableName,
    ssl: configService.databaseSSL,
  });
}

const dataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [
    ContentEntity,
    SavedContent,
    UserEntity,
    MoodEntity,
    UserPreferencesEntity,
  ],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  ssl: process.env.DB_SSL === 'true',
});

export async function dataSourceInit() {
  if (!process.env.DB_HOST || !process.env.DB_NAME) {
    console.warn(
      '⚠️ Database connection skipped: missing DB_HOST or DB_NAME environment variables.',
    );
    return null;
  }
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export default dataSource;
