# Recommendation Module

## Overview

The Recommendation Module implements a rule-based recommendation engine that analyzes user mood history and content interactions to provide personalized content recommendations. This module is designed to work with the existing user preferences and content systems to deliver intelligent, mood-aware content suggestions.

## Features

- **Rule-based Recommendation Engine**: Analyzes user mood patterns and preferences
- **Mood-Intensity Mapping**: Considers both mood type and intensity level for content matching
- **Fallback Recommendations**: Provides general recommendations for new users or when personalization fails
- **Confidence Scoring**: Each recommendation includes a confidence score and reasoning
- **Performance Optimization**: Designed for real-time recommendation generation
- **Quality Metrics**: Tracks recommendation performance and user satisfaction

## Architecture

### Core Components

1. **RecommendationService**: Main business logic for generating recommendations
2. **RecommendationController**: REST API endpoints for recommendation operations
3. **DTOs**: Data transfer objects for API requests and responses
4. **Documentation**: Swagger/OpenAPI decorators for API documentation

### Dependencies

- **UserPreferencesModule**: Access to user mood preferences and settings
- **ContentsModule**: Access to available content for recommendations
- **AuthModule**: JWT authentication for secure API access

## API Endpoints

### POST /recommendations/generate

Generate personalized content recommendations based on user mood and preferences.

**Request Body:**
```json
{
  "currentMood": "happy",
  "moodIntensity": 7,
  "limit": 10,
  "contentTypes": ["music", "movies"]
}
```

**Response:**
```json
[
  {
    "id": "content-123",
    "title": "Happy Playlist",
    "type": "music",
    "mood": "happy",
    "intensity": 7,
    "confidence": 0.85,
    "reason": "Matches your mood preferences"
  }
]
```

### GET /recommendations/quality-metrics

Retrieve recommendation quality metrics for the authenticated user.

**Response:**
```json
{
  "totalRecommendations": 50,
  "acceptedRecommendations": 42,
  "rejectedRecommendations": 8,
  "averageConfidence": 0.78,
  "userSatisfaction": 0.84
}
```

### GET /recommendations/health

Health check endpoint for the recommendation service.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "recommendation-engine"
}
```

## Recommendation Algorithm

### Rule-Based Logic

The recommendation engine uses a multi-layered approach:

1. **User Preferences Analysis**: Checks user-specific mood preferences and intensity settings
2. **Mood-Content Mapping**: Applies predefined rules for different mood types
3. **Intensity Thresholds**: Considers mood intensity for content type selection
4. **Priority Scoring**: Ranks content types based on user preferences and mood context
5. **Confidence Calculation**: Computes confidence scores based on multiple factors

### Mood-Content Mappings

| Mood | Preferred Content Types | Intensity Range | Priority |
|------|------------------------|----------------|----------|
| Happy | Music, Movies, Books | 1-10 | Music (1), Movies (2), Books (3) |
| Sad | Music, Books, Movies | 1-8 | Music (1), Books (2), Movies (3) |
| Energetic | Music, Movies, Books | 6-10 | Music (1), Movies (2), Books (3) |
| Calm | Books, Music, Movies | 1-6 | Books (1), Music (2), Movies (3) |
| Stressed | Music, Books, Movies | 1-4 | Music (1), Books (2), Movies (3) |

### Confidence Scoring

Confidence scores range from 0.0 to 1.0 and are calculated based on:

- **Base Confidence**: 0.5 (neutral starting point)
- **Mood Preference Match**: +0.2 (when content type matches user preferences)
- **Intensity Match**: +0.3 (when mood intensity aligns with content thresholds)
- **Priority Boost**: +0.1 (for high-priority content types)

## Fallback System

When personalized recommendations cannot be generated (new users, missing preferences, errors), the system provides fallback recommendations:

- **Default Content Types**: Based on mood-specific mappings
- **General Confidence**: Fixed at 0.5
- **Standard Reasoning**: "General recommendation based on mood"

## Performance Considerations

- **Real-time Generation**: Optimized for sub-second response times
- **Caching Ready**: Designed to integrate with Redis caching (future enhancement)
- **Async Processing**: Non-blocking recommendation generation
- **Error Handling**: Graceful degradation to fallback recommendations

## Future Enhancements

### Planned Features (Future Issues)

1. **User Mood History Tracking** (Issue #71): Database schema for mood changes over time
2. **Content Interaction Tracking** (Issue #72): User behavior analysis (likes, dislikes, saves)
3. **Collaborative Filtering** (Issue #73): User similarity-based recommendations
4. **A/B Testing Framework** (Issue #74): Recommendation algorithm optimization
5. **Advanced Analytics** (Issue #75): Deep learning and machine learning integration

### Technical Improvements

- **Redis Caching**: Cache frequently requested recommendations
- **Batch Processing**: Generate recommendations for multiple users simultaneously
- **Database Indexing**: Optimize queries for mood and preference lookups
- **Real-time Updates**: WebSocket support for live recommendation updates

## Testing

The module includes comprehensive test coverage:

- **Unit Tests**: Service logic and business rules
- **Controller Tests**: API endpoint behavior and validation
- **Mock Dependencies**: Isolated testing of recommendation logic
- **Error Scenarios**: Graceful handling of edge cases

Run tests with:
```bash
npm test -- --testPathPattern=recommendation
```

## Usage Examples

### Basic Recommendation Generation

```typescript
// In a service or controller
const recommendations = await recommendationService.generateRecommendations({
  userId: 123,
  currentMood: 'happy',
  moodIntensity: 8,
  limit: 5
});
```

### Custom Content Type Filtering

```typescript
const musicRecommendations = await recommendationService.generateRecommendations({
  userId: 123,
  currentMood: 'calm',
  contentTypes: ['music'],
  limit: 3
});
```

## Configuration

The recommendation engine is configurable through:

- **Mood Mappings**: Predefined content type preferences for each mood
- **Intensity Thresholds**: Customizable intensity ranges for content types
- **Confidence Weights**: Adjustable scoring parameters
- **Fallback Settings**: Default recommendation behavior

## Security

- **JWT Authentication**: All endpoints require valid authentication
- **User Isolation**: Recommendations are scoped to authenticated user
- **Input Validation**: Request parameters are validated and sanitized
- **Error Handling**: Sensitive information is not exposed in error responses

## Monitoring and Observability

- **Health Checks**: Service status monitoring
- **Quality Metrics**: Recommendation performance tracking
- **Error Logging**: Comprehensive error logging for debugging
- **Performance Metrics**: Response time and throughput monitoring

## Contributing

When contributing to the recommendation module:

1. **Follow NestJS Patterns**: Maintain consistency with existing codebase
2. **Add Tests**: Ensure new features include comprehensive test coverage
3. **Update Documentation**: Keep README and API docs current
4. **Performance Testing**: Validate changes don't impact response times
5. **Error Handling**: Implement graceful degradation for all scenarios
