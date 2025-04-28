import {DataSource} from 'typeorm';
import { config } from 'dotenv';
import { globSync } from 'glob';
import { SnakeNamingStrategy } from '@utils/snake_snake';

config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'});

const dataSource = new DataSource({
    type: (process.env.DB_TYPE as any) || 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities:  globSync(process.env.DB_ENTITIES || 'src/**/*.entity.{ts,js}'),
    namingStrategy: new SnakeNamingStrategy(),
    migrations:  globSync(
        process.env.DB_MIGRATIONS || 'src/database/migrations/*.{ts,js}',
      ),
    migrationsTableName: 'migrations',
    ssl: process.env.DB_SSL === 'true'
})

export async function dataSourceInit() {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    return dataSource;
  }
  export default dataSource;