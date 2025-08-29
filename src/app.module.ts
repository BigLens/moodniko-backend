import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodModule } from '@modules/mood/mood.module';
import { ContentsModule } from '@modules/contents/contents.module';
import { MoviesModule } from '@modules/contents/providers/movies/movies.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { UserPreferencesModule } from '@modules/user-preferences/user-preferences.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { SnakeNamingStrategy } from '@utils/snake_snake';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        type: configService.databaseType as any,
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        synchronize: configService.databaseSynchronize,
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        migrations: [],
        migrationsTableName: configService.databaseMigrationsTableName,
        ssl: configService.databaseSSL,
      }),
      inject: [AppConfigService],
    }),
    MoodModule,
    ContentsModule,
    MoviesModule,
    HealthModule,
    AuthModule,
    UserModule,
    UserPreferencesModule,
    RecommendationModule,
    InteractionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
