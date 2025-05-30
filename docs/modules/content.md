# MoodNiko Content Module

The Content Module is a core component of MoodNiko that handles content recommendations and third-party service integrations. This document provides an overview of the module's architecture and integration points.

## Module Structure

```
src/modules/content/
├── content.controller.ts    # API endpoints and request handling
├── content.service.ts       # Business logic and service orchestration
├── content.module.ts        # Module configuration and dependencies
├── dto/                     # Data Transfer Objects
├── entities/               # Database entities
└── integrations/           # Third-party service integrations
    ├── spotify/           # Spotify API integration
    └── tmdb/             # TMDB API integration
```

## Mood-to-Genre Mapping

The content module implements a sophisticated mood-to-genre mapping system that translates user moods into appropriate content categories:

- **Happy**: Upbeat music, comedy movies, light-hearted books
- **Sad**: Soothing music, feel-good movies, uplifting books
- **Anxious**: Calming music, relaxing movies, self-help books
- **Energetic**: High-energy music, action movies, motivational content

This mapping is configurable and can be extended to support additional moods and content types.

## ContentService

The `ContentService` is the central orchestrator that:

1. Processes user mood inputs
2. Maps moods to appropriate content genres
3. Delegates to specific integration services (Spotify, TMDB)
4. Aggregates and ranks content recommendations
5. Handles caching and rate limiting

## Third-Party Integrations

### Spotify Integration

- Handles music recommendations
- Requires Spotify API credentials
- Configuration in `.env`:
  ```
  SPOTIFY_CLIENT_ID=your_client_id
  SPOTIFY_CLIENT_SECRET=your_client_secret
  ```

### TMDB Integration

- Manages movie and TV show recommendations
- Requires TMDB API key
- Configuration in `.env`:
  ```
  TMDB_API_KEY=your_api_key
  ```

## API Documentation

Detailed API documentation is available through Swagger UI at:

```
http://localhost:4002/api/docs
```

The Swagger documentation includes:

- Complete endpoint specifications
- Request/response schemas
- Authentication requirements
- Example requests and responses

## Getting Started

1. Ensure all required environment variables are set
2. Install dependencies: `npm install`
3. Start the application: `npm run start:dev`
4. Access Swagger UI to explore available endpoints

## Contributing

When contributing to the content module:

1. Follow the existing code structure
2. Add appropriate tests for new features
3. Update Swagger documentation for any new endpoints
4. Ensure proper error handling and rate limiting
5. Follow the established mood-to-genre mapping patterns

## Best Practices

- Use the provided DTOs for request validation
- Implement proper error handling for third-party service failures
- Cache responses when appropriate to improve performance
- Follow rate limiting guidelines for third-party APIs
- Keep the mood-to-genre mapping configurable and extensible
