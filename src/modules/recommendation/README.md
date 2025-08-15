# Recommendation Module

## Overview

The Recommendation Module implements a rule-based recommendation engine that analyzes user mood history and content interactions to provide personalized content recommendations. This module is designed to work with the existing user preferences and content systems to deliver intelligent, mood-aware content suggestions.

## Structure

```
recommendation/
├── dto/
│   └── recommendation-request.dto.ts        # DTO for recommendation requests
├── docs/
│   └── recommendation.docs.ts               # Swagger/OpenAPI documentation decorators
├── interfaces/
│   └── recommendation.interface.ts          # TypeScript interfaces
├── recommendation.service.ts                 # Core recommendation engine
├── recommendation.controller.ts              # API endpoints
└── README.md                                # This file
```

## Features

### Core Functionality
- **Rule-based Recommendation Engine**: Analyzes user mood patterns and preferences
- **Mood-Intensity Mapping**: Considers both mood type and intensity level for content matching
- **Historical Data Integration**: Uses actual user mood history for intelligent recommendations
- **Fallback Recommendations**: Provides general recommendations for new users or when personalization fails
- **Confidence Scoring**: Each recommendation includes a confidence score and reasoning
- **Performance Optimization**: Designed for real-time recommendation generation
- **Quality Metrics**: Tracks recommendation performance and user satisfaction

### Advanced Features
- **Pattern Recognition**: Identifies frequent moods and content preferences
- **Trigger Matching**: Content suggestions that match mood triggers
- **Trend Analysis**: Considers mood stability and intensity trends
- **Content Interaction Correlation**: Analyzes how moods affect content consumption

## API Endpoints

### Core Endpoints
- `POST /recommendations/generate` - Generate personalized content recommendations
- `GET /recommendations/quality-metrics` - Get recommendation quality metrics
- `GET /recommendations/health` - Service health check

## Dependencies

- **UserPreferencesModule**: Access to user mood preferences and settings
- **ContentsModule**: Access to available content for recommendations
- **MoodModule**: Access to mood history and pattern analysis
- **AuthModule**: JWT authentication for secure API access
- **class-validator**: Input validation
- **class-transformer**: Request parameter transformation

## Usage

### Basic Recommendation Generation

```typescript
// Generate recommendations for a happy mood
const recommendations = await recommendationService.generateRecommendations({
  userId: 123,
  currentMood: 'happy',
  moodIntensity: 8,
  limit: 5
});
```

### Custom Content Type Filtering

```typescript
// Get only music recommendations for a calm mood
const musicRecommendations = await recommendationService.generateRecommendations({
  userId: 123,
  currentMood: 'calm',
  contentTypes: ['music'],
  limit: 3
});
```

## Recommendation Algorithm

### Rule-Based Logic

The recommendation engine uses a multi-layered approach:

1. **User Preferences Analysis**: Checks user-specific mood preferences and intensity settings
2. **Historical Pattern Analysis**: Analyzes mood patterns over time
3. **Mood-Content Mapping**: Applies predefined rules for different mood types
4. **Intensity Thresholds**: Considers mood intensity for content type selection
5. **Priority Scoring**: Ranks content types based on user preferences and mood context
6. **Confidence Calculation**: Computes confidence scores based on multiple factors

### Confidence Scoring

Confidence scores range from 0.0 to 1.0 and are calculated based on:

- **Base Confidence**: 0.5 (neutral starting point)
- **Mood Preference Match**: +0.2 (when content type matches user preferences)
- **Intensity Match**: +0.3 (when mood intensity aligns with content thresholds)
- **Priority Boost**: +0.1 (for high-priority content types)
- **Historical Pattern Match**: +0.1 (when mood is frequently experienced)
- **Trigger Match**: +0.15 (when content matches mood triggers)
- **Mood Stability**: +0.05 (for high mood stability patterns)

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
- **Database Optimization**: Efficient queries with proper indexing

## Quality Metrics

The system tracks comprehensive metrics:

- **Total Recommendations**: Number of recommendations generated
- **Acceptance Rate**: Percentage of recommendations accepted by users
- **Average Confidence**: Mean confidence score across all recommendations
- **User Satisfaction**: Overall satisfaction score
- **Mood Stability**: User's mood consistency patterns
- **Pattern Recognition**: Number of mood patterns identified
- **Trend Analysis**: Number of mood trends analyzed

## Integration

This module integrates with:
- **Mood History Module**: Provides historical mood data and pattern analysis
- **User Preferences**: Works with mood preferences and intensity settings
- **Content System**: Accesses available content for recommendations
- **Authentication**: Secure user-specific recommendations

## Future Enhancements

### Planned Features
- **Machine Learning**: Advanced recommendation algorithms
- **Real-time Updates**: WebSocket support for live recommendations
- **A/B Testing**: Recommendation algorithm optimization
- **Advanced Analytics**: Deep learning and predictive analytics

### Technical Improvements
- **Redis Caching**: Cache frequently requested recommendations
- **Batch Processing**: Generate recommendations for multiple users simultaneously
- **Database Indexing**: Optimize queries for mood and preference lookups

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
