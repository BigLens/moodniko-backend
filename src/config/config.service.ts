import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    const secret = this.configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return secret;
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('jwt.expiresIn') || '24h';
  }

  get databaseType(): string {
    return this.configService.get<string>('database.type') || 'postgres';
  }

  get databaseHost(): string {
    return this.configService.get<string>('database.host') || 'localhost';
  }

  get databasePort(): number {
    return this.configService.get<number>('database.port') || 5432;
  }

  get databaseUsername(): string {
    return this.configService.get<string>('database.username') || 'postgres';
  }

  get databasePassword(): string {
    return this.configService.get<string>('database.password') || '';
  }

  get databaseName(): string {
    return this.configService.get<string>('database.database') || 'moodmate';
  }

  get databaseSSL(): boolean {
    return this.configService.get<boolean>('database.ssl') || false;
  }

  get databaseSynchronize(): boolean {
    return this.configService.get<boolean>('database.synchronize') || false;
  }

  get databaseEntities(): string {
    return (
      this.configService.get<string>('database.entities') ||
      'src/**/*.entity.{ts,js}'
    );
  }

  get databaseMigrations(): string {
    return (
      this.configService.get<string>('database.migrations') ||
      'src/database/migrations/*.{ts,js}'
    );
  }

  get databaseMigrationsTableName(): string {
    return (
      this.configService.get<string>('database.migrationsTableName') ||
      'migrations'
    );
  }

  get port(): number {
    return this.configService.get<number>('app.port') || 4002;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('app.nodeEnv') || 'development';
  }

  get apiPrefix(): string {
    return this.configService.get<string>('app.apiPrefix') || 'api';
  }

  get spotifyClientId(): string {
    return this.configService.get<string>('thirdParty.spotify.clientId') || '';
  }

  get spotifyClientSecret(): string {
    return (
      this.configService.get<string>('thirdParty.spotify.clientSecret') || ''
    );
  }

  get tmdbApiKey(): string {
    return this.configService.get<string>('thirdParty.tmdb.apiKey') || '';
  }

  get googleBooksApiKey(): string {
    return (
      this.configService.get<string>('thirdParty.googleBooks.apiKey') || ''
    );
  }

  validateEnvironment(): void {
    const requiredVars = [
      { key: 'JWT_SECRET', value: this.jwtSecret },
      { key: 'DB_HOST', value: this.databaseHost },
      { key: 'DB_USERNAME', value: this.databaseUsername },
      { key: 'DB_PASSWORD', value: this.databasePassword },
      { key: 'DB_NAME', value: this.databaseName },
    ];

    const missingVars = requiredVars.filter(({ value }) => !value);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars
          .map(({ key }) => key)
          .join(', ')}`,
      );
    }
  }
}
