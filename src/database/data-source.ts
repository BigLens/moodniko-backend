import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { globSync } from 'glob';
import { SnakeNamingStrategy } from '@utils/snake_snake';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { SavedContent } from '@modules/contents/save_contents/save-content.entity';
import { UserEntity } from '@modules/user/entity/user.entity';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { UserPreferencesEntity } from '@modules/user-preferences/entity/user-preferences.entity';
import { AppConfigService } from '../config/config.service';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

// Create a function to get data source configuration
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
      ...(globSync(configService.databaseEntities) as any[]),
    ],
    namingStrategy: new SnakeNamingStrategy(),
    migrations: globSync(configService.databaseMigrations),
    migrationsTableName: configService.databaseMigrationsTableName,
    ssl: configService.databaseSSL,
  });
}

// For backward compatibility, create a default data source
// This will be used when the config service is not available (e.g., during migrations)
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
    ...(globSync(
      process.env.DB_ENTITIES || 'src/**/*.entity.{ts,js}',
    ) as any[]),
  ],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: globSync(
    process.env.DB_MIGRATIONS || 'src/database/migrations/*.{ts,js}',
  ),
  migrationsTableName: 'migrations',
  ssl: process.env.DB_SSL === 'true',
});

export async function dataSourceInit() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export default dataSource;
