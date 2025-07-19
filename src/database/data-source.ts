import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { globSync } from 'glob';
import { SnakeNamingStrategy } from '@utils/snake_snake';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { SavedContent } from '@modules/contents/save_contents/save-content.entity';
import { UserEntity } from '@modules/user/entity/user.entity';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

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
