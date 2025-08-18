# Content Interaction Tracking Module

## Overview

The Content Interaction Tracking module implements a comprehensive system to track how users interact with content (like, dislike, save, view, etc.) to improve recommendation accuracy. This module provides the behavioral data foundation for the recommendation engine.

## Features

### Core Functionality

- **Interaction Tracking**: Records user interactions with content items including:
  - Like, dislike, save, share, skip, play, complete, and rate actions
  - Interaction metadata (duration, context, notes)
  - Mood data at time of interaction
  - Timestamps and user identification

- **Interaction History**: Retrieves and filters user interaction history with pagination support

- **Pattern Analysis**: Analyzes interaction patterns to identify:
  - Most common interaction types
  - Average interaction duration
  - Mood correlations
  - Time patterns and content preferences

- **Data Export**: Exports interaction data in JSON or CSV format for analysis

### API Endpoints

#### POST `/interactions/track`
Tracks a new user interaction with content.

**Request Body:**
```json
{
  "userId": 1,
  "contentId": "123",
  "interactionType": "like",
  "interactionValue": 5,
  "moodAtInteraction": "happy",
  "moodIntensityAtInteraction": 8,
  "interactionDurationSeconds": 120,
  "context": "evening relaxation",
  "notes": "Really enjoyed this content"
}
```

#### GET `/interactions/history/:userId`
Retrieves interaction history for a specific user.

**Query Parameters:**
- `limit`: Maximum number of results (default: 50)
- `offset`: Number of results to skip for pagination
- `interactionType`: Filter by interaction type
- `startDate`: Filter by start date (ISO string)
- `endDate`: Filter by end date (ISO string)

#### GET `/interactions/patterns/:userId`
Analyzes interaction patterns for a specific user.

**Response:**
```json
{
  "totalInteractions": 25,
  "dateRange": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-12-31T23:59:59.999Z"
  },
  "patterns": {
    "mostCommonType": "like",
    "averageDuration": 120,
    "moodCorrelation": 0.7,
    "timeOfDayPattern": "evening",
    "contentTypePreference": "movies"
  },
  "trends": {
    "interactionFrequency": "increasing",
    "moodCorrelation": "positive"
  }
}
```

#### GET `/interactions/export/:userId`
Exports interaction data for a specific user.

**Query Parameters:**
- `format`: Export format (`json` or `csv`)
- `startDate`: Filter by start date (ISO string)
- `endDate`: Filter by end date (ISO string)
- `includeMoodData`: Include mood data in export (boolean)

## Database Schema

### user_content_interactions Table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key to users table |
| content_id | INTEGER | Foreign key to contents table |
| interaction_type | ENUM | Type of interaction (like, dislike, save, etc.) |
| interaction_value | INTEGER | Interaction value (e.g., rating 1-10) |
| mood_at_interaction | VARCHAR(50) | User mood at time of interaction |
| mood_intensity_at_interaction | INTEGER | Mood intensity (1-10) |
| interaction_duration_seconds | INTEGER | Duration of interaction |
| context | TEXT | Context of the interaction |
| notes | TEXT | Additional notes |
| created_at | TIMESTAMP | When interaction was recorded |
| updated_at | TIMESTAMP | Last update timestamp |

### Indexes

- `IDX_USER_CONTENT_INTERACTIONS_USER_ID`: On user_id for fast user lookups
- `IDX_USER_CONTENT_INTERACTIONS_CONTENT_ID`: On content_id for fast content lookups
- `IDX_USER_CONTENT_INTERACTIONS_TYPE`: On interaction_type for filtering
- `IDX_USER_CONTENT_INTERACTIONS_CREATED_AT`: On created_at for date-based queries
- `IDX_USER_CONTENT_INTERACTIONS_MOOD`: On mood_at_interaction for mood analysis
- `IDX_USER_CONTENT_INTERACTIONS_UNIQUE`: Unique constraint on (user_id, content_id, interaction_type)

## Implementation Details

### Service Layer

The `InteractionsService` provides:

- **Repository Integration**: Uses TypeORM repository for database operations
- **Data Validation**: Ensures data integrity before saving
- **Pattern Analysis**: Implements algorithms for interaction pattern recognition
- **Error Handling**: Graceful error handling with meaningful error messages

### Controller Layer

The `InteractionsController` provides:

- **REST API Endpoints**: Clean, RESTful API design
- **Input Validation**: Uses DTOs with class-validator decorators
- **Swagger Documentation**: Comprehensive API documentation
- **Error Handling**: HTTP status codes and error messages

### Data Transfer Objects (DTOs)

- **TrackInteractionDto**: For tracking new interactions
- **InteractionHistoryQueryDto**: For querying interaction history
- **ExportQueryDto**: For data export requests

## Usage Examples

### Tracking an Interaction

```typescript
// In your application code
const interactionData = {
  userId: 1,
  contentId: "movie-123",
  interactionType: "like",
  moodAtInteraction: "excited",
  moodIntensityAtInteraction: 9,
  context: "weekend movie night"
};

await this.interactionsService.trackInteraction(
  interactionData.userId,
  interactionData.contentId,
  interactionData.interactionType,
  interactionData
);
```

### Analyzing User Patterns

```typescript
// Get interaction patterns for user
const patterns = await this.interactionsService.analyzeInteractionPatterns(1);

console.log(`User has ${patterns.totalInteractions} total interactions`);
console.log(`Most common interaction: ${patterns.patterns.mostCommonType}`);
console.log(`Average duration: ${patterns.patterns.averageDuration} seconds`);
```

## Integration with Recommendation Engine

This module integrates with the recommendation engine by:

1. **Providing Behavioral Data**: Tracks user preferences and behaviors
2. **Mood Correlation**: Links interactions with user mood states
3. **Pattern Recognition**: Identifies user interaction patterns
4. **Historical Analysis**: Enables trend analysis for better recommendations

## Security and Privacy

- **User Isolation**: All queries are scoped to specific users
- **Data Validation**: Input validation prevents malicious data
- **Access Control**: Endpoints require proper authentication
- **Data Retention**: Configurable data retention policies

## Future Enhancements

- **Real-time Analytics**: WebSocket support for live interaction tracking
- **Advanced Pattern Recognition**: Machine learning for pattern detection
- **A/B Testing**: Framework for testing different interaction tracking strategies
- **Performance Optimization**: Caching and query optimization
- **Batch Processing**: Bulk interaction processing for analytics

## Testing

The module includes comprehensive test coverage:

- **Unit Tests**: Service and controller unit tests
- **Integration Tests**: End-to-end API testing
- **Mock Data**: Realistic test data for development

## Dependencies

- **@nestjs/typeorm**: Database ORM integration
- **class-validator**: Input validation
- **@nestjs/swagger**: API documentation
- **TypeORM**: Database operations and migrations

## Migration

The database migration `1753203984800-CreateUserContentInteractionsTable.ts` creates the required table structure with proper indexes and constraints.

Run migrations with:
```bash
npm run migration:run
```
