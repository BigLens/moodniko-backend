import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './database/data-source';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
}),

TypeOrmModule.forRootAsync({
  useFactory: async () => ({
  ...dataSource.options
  }),
  dataSourceFactory: async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    return dataSource;
  }
})
]
})
export class AppModule {}