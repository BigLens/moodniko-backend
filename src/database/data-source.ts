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

function parseDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  };
}

let dbConfig: any = {
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' || process.env.DATABASE_SSL === 'true',
};

if (process.env.DATABASE_URL) {
  const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
  dbConfig = {
    ...dbConfig,
    host: parsed.host,
    port: parsed.port,
    username: parsed.username,
    password: parsed.password,
    database: parsed.database,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const dataSource = new DataSource({
  ...dbConfig,
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
});

export async function dataSourceInit() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export default dataSource;
