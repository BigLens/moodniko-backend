# MoodNiko Content Module

The Content Module is the core component of MoodNiko that handles mood-based content recommendations and third-party service integrations. This module is responsible for understanding the user's current emotional state and providing appropriate content suggestions to either enhance their current mood or help them transition to a more positive state.

## Module Structure

```
src/modules/contents/
├── contents.controller.ts    # API endpoints and request handling
├── contents.service.ts       # Business logic and service orchestration
├── contents.module.ts        # Module configuration and dependencies
├── dto/                     # Data Transfer Objects
├── entities/               # Database entities
└── integrations/           # Third-party service integrations
    ├── spotify/           # Spotify API integration
    ├── tmdb/             # TMDB API integration
    └── books/            # Books API integration
```

## Mood-to-Genre Mapping

The content module implements an intelligent mood-to-genre mapping system that translates user moods into appropriate content categories. This mapping is designed to either enhance positive moods or provide uplifting content for challenging emotional states:

- **Happy**:

  - Upbeat music to maintain the positive mood
  - Comedy movies to keep the good vibes going
  - Light-hearted books to continue the positive experience

- **Sad**:

  - Soothing music to provide comfort
  - Feel-good movies to lift spirits
  - Uplifting books to inspire hope

- **Anxious**:

  - Calming music to reduce stress
  - Relaxing movies to help unwind
  - Self-help books to provide guidance

- **Energetic**:
  - High-energy music to match the mood
  - Action movies to channel the energy
  - Motivational content to maintain momentum

This mapping is configurable and can be extended to support additional moods and content types.

## ContentService

The `ContentService` is the central orchestrator that:

1. Processes user's current mood input
2. Maps the mood to appropriate content genres
3. Delegates to specific integration services (Spotify, TMDB, GOOGLE BOOKS)
4. Aggregates and ranks content recommendations
5. Handles caching and rate limiting
6. Provides supportive messages based on the user's mood

## Third-Party Integrations

### Spotify Integration

- Handles music and podcast recommendations based on mood
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

### GOOGLE BOOKS Integration

- Manages book recommendations
- Requires GOOGLE BOOKS API key
- Configuration in `.env`:
  ```
  GOOGLE_BOOKS_API_KEY=your_api_key
  ```

## API Documentation

Detailed API documentation is available through Swagger UI at:

```
http://localhost:4002/api/docs
```

The Swagger documentation includes:

- Complete endpoint specifications
- Request/response schemas
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
- Ensure content recommendations are appropriate for the user's current emotional state
