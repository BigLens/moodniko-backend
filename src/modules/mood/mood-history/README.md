# Mood History Module

## Overview

The Mood History Module provides comprehensive tracking and analysis of user mood patterns over time. This module is designed to work with the recommendation engine to provide data-driven insights and personalized content suggestions.

## Structure

```
mood-history/
├── dto/
│   ├── create-mood.dto.ts                    # DTO for creating mood entries
│   ├── mood-analysis-query.dto.ts            # DTO for analysis query parameters
│   ├── mood-patterns-query.dto.ts            # DTO for patterns query parameters
│   ├── content-recommendations-query.dto.ts  # DTO for content recommendations
│   └── export-query.dto.ts                   # DTO for export query parameters
├── interfaces/
│   └── mood-history.interface.ts             # TypeScript interfaces for the module
├── docs/
│   └── mood-history.docs.ts                  # Swagger/OpenAPI documentation decorators
├── mood-history.service.ts                    # Core service for mood analysis
├── mood-history.controller.ts                 # API endpoints for mood history
└── README.md                                  # This file
```

## Features

### Core Functionality
- **Mood Pattern Analysis**: Identifies common mood patterns, frequency, and triggers
- **Trend Detection**: Analyzes mood stability and intensity trends over time
- **Data Export**: JSON and CSV export functionality for user data
- **Performance Optimization**: Indexed database queries for fast analysis
- **Input Validation**: Comprehensive DTO validation with class-validator and class-transformer

### Analysis Capabilities
- **Time-based Analysis**: Day, week, month, and year period analysis
- **Pattern Recognition**: Identifies mood triggers, time-of-day patterns, day-of-week patterns
- **Stability Metrics**: Calculates mood stability and intensity trends
- **Smart Recommendations**: Generates insights based on mood patterns
- **Content Interaction Analysis**: Correlates moods with content consumption behavior

## API Endpoints

### Analysis Endpoints
- `GET /mood-history/analysis` - Comprehensive mood analysis
- `GET /mood-history/patterns` - Mood pattern recognition
- `GET /mood-history/trends` - Mood trend analysis
- `GET /mood-history/frequency` - Mood frequency statistics
- `GET /mood-history/triggers` - Mood trigger analysis

### Content Interaction Analysis
- `GET /mood-history/content-interactions` - Content interaction analysis correlated with moods
- `GET /mood-history/content-recommendations` - Content recommendations based on mood and interaction history

### Data Management
- `GET /mood-history/export` - Data export (JSON/CSV)
- `GET /mood-history/health` - Service health check

## Dependencies

- **MoodEntity**: Core mood data entity
- **UserContentInteractionEntity**: Content interaction tracking
- **TypeORM**: Database operations and queries
- **JWT Authentication**: Secure API access
- **class-validator**: Input validation
- **class-transformer**: Query parameter transformation

## Usage

### Basic Mood Analysis
```typescript
// Get 30-day mood analysis
const analysis = await moodHistoryService.analyzeMoodHistory(userId, 30);

// Get mood patterns for current month
const patterns = await moodHistoryService.getMoodPatterns(userId, 'month');

// Get mood trends over 60 days
const trends = await moodHistoryService.getMoodTrends(userId, 60);
```

### Data Export
```typescript
// Export as JSON
const jsonData = await moodHistoryService.exportMoodHistory(userId, 'json', 365);

// Export as CSV
const csvData = await moodHistoryService.exportMoodHistory(userId, 'csv', 90);
```

## Integration

This module integrates with:
- **Recommendation Engine**: Provides historical data for personalized recommendations
- **User Preferences**: Works with mood preferences and intensity settings
- **Content Interactions**: Correlates moods with content consumption patterns

## Performance Considerations

- **Database Indexing**: Optimized indexes on commonly queried fields
- **Query Optimization**: Efficient date range queries and pattern analysis
- **Caching Ready**: Designed for future Redis integration
- **Real-time Analysis**: Sub-second response times for analysis queries

## Future Enhancements

- **Machine Learning**: Advanced pattern recognition algorithms
- **Predictive Analytics**: Mood prediction based on historical patterns
- **Real-time Streaming**: WebSocket support for live mood updates
- **Advanced Visualizations**: Chart and graph data representations