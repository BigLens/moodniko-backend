# Environment Variables Documentation

This document describes all environment variables used by the MoodNiko application.

## Required Environment Variables

### JWT Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT token signing | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | `24h` | No |

### Database Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_TYPE` | Database type | `postgres` | No |
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | No |
| `DB_USERNAME` | Database username | `postgres` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_NAME` | Database name | `moodmate` | Yes |
| `DB_SSL` | Enable SSL for database | `false` | No |

### Application Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment | `development` | No |
| `PORT` | Application port | `4002` | No |
| `API_PREFIX` | API route prefix | `api` | No |

## Required Environment Variables

### Third Party API Keys
| Variable | Description | Required |
|----------|-------------|----------|
| `SPOTIFY_CLIENT_ID` | Spotify API client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Spotify API client secret | Yes |
| `TMDB_API_KEY` | The Movie Database API key | Yes |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key | Yes |

### Advanced Database Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `DB_ENTITIES` | Entity file pattern | `src/**/*.entity.{ts,js}` |
| `DB_MIGRATIONS` | Migration file pattern | `src/database/migrations/*.{ts,js}` |

## Environment Setup

### Development
```bash
# Copy the example file
cp .env.example .env

# Edit the file with your values
nano .env
```

### Production
```bash
# Set required variables
export JWT_SECRET="your-super-secret-jwt-secret"
export DB_HOST="your-database-host"
export DB_USERNAME="your-database-username"
export DB_PASSWORD="your-database-password"
export DB_NAME="your-database-name"
export SPOTIFY_CLIENT_ID="your-spotify-client-id"
export SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
export TMDB_API_KEY="your-tmdb-api-key"
export GOOGLE_BOOKS_API_KEY="your-google-books-api-key"
export NODE_ENV="development"
```

## Security Considerations

1. **JWT_SECRET**: Use a strong, random secret key
2. **Database Password**: Use strong passwords for production databases
3. **SSL**: Enable SSL for production database connections
4. **API Keys**: Keep third-party API keys secure and rotate regularly

## Configuration Validation

The application validates required environment variables on startup. Missing required variables will cause the application to exit with an error message.

## Environment File Priority

The application loads environment variables in the following order:
1. `.env.local` (highest priority)
2. `.env`
3. System environment variables (lowest priority) 