import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './database/data-source';
import { MoodModule } from '@modules/mood/mood.module';
import { ContentsModule } from '@modules/contents/contents.module';
import { MoviesModule } from '@modules/contents/providers/movies/movies.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
        return dataSource;
      },
    }),
    MoodModule,
    ContentsModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
