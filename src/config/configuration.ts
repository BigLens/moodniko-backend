import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
}));

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

export const databaseConfig = registerAs('database', () => {
  let config: any = {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'moodmate',
    ssl: process.env.DB_SSL === 'true' || process.env.DATABASE_SSL === 'true',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || false,
    entities: process.env.DB_ENTITIES || 'src/**/*.entity.{ts,js}',
    migrations:
      process.env.DB_MIGRATIONS || 'src/database/migrations/*.{ts,js}',
    migrationsTableName: 'migrations',
  };

  if (process.env.DATABASE_URL) {
    const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
    config = {
      ...config,
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

  return config;
});

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '4002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
}));

export const thirdPartyConfig = registerAs('thirdParty', () => ({
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
  },
  googleBooks: {
    apiKey: process.env.GOOGLE_BOOKS_API_KEY,
  },
}));
