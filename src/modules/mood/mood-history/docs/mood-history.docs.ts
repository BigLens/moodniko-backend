import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const MoodHistoryApiTags = () => ApiTags('mood-history');

export const GetMoodAnalysisDocs = () =>
  ApiOperation({
    summary: 'Get comprehensive mood history analysis',
    description:
      'Retrieve detailed analysis of user mood patterns, trends, and recommendations over a specified time period.',
  });

export const GetMoodPatternsDocs = () =>
  ApiOperation({
    summary: 'Get mood patterns for specific time periods',
    description:
      'Analyze mood patterns for day, week, month, or year periods to identify recurring emotional patterns.',
  });

export const GetMoodTrendsDocs = () =>
  ApiOperation({
    summary: 'Get mood trends over time',
    description:
      'Analyze mood stability and intensity trends over specified days to understand emotional progression.',
  });

export const GetMoodFrequencyDocs = () =>
  ApiOperation({
    summary: 'Get mood frequency analysis',
    description:
      'Analyze how frequently different moods occur and their percentage distribution over time.',
  });

export const GetMoodTriggersDocs = () =>
  ApiOperation({
    summary: 'Get mood triggers analysis',
    description:
      'Identify common triggers that cause specific moods and their frequency patterns.',
  });

export const GetContentInteractionAnalysisDocs = () =>
  ApiOperation({
    summary: 'Get content interaction analysis correlated with moods',
    description:
      'Analyze how user content interactions (likes, dislikes, saves) correlate with different mood states.',
  });

export const GetContentRecommendationsByMoodDocs = () =>
  ApiOperation({
    summary:
      'Get content recommendations based on mood and interaction history',
    description:
      'Provide personalized content type recommendations based on current mood and historical interaction patterns.',
  });

export const ExportMoodHistoryDocs = () =>
  ApiOperation({
    summary: 'Export mood history data',
    description:
      'Export mood history data in JSON or CSV format for user analysis or backup purposes.',
  });

export const HealthCheckDocs = () =>
  ApiOperation({
    summary: 'Mood history service health check',
    description: 'Check the health status of the mood history service.',
  });

// Response decorators
export const MoodAnalysisResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Mood history analysis retrieved successfully',
    schema: {
      example: {
        totalEntries: 45,
        dateRange: {
          start: '2024-01-01T00:00:00.000Z',
          end: '2024-01-30T23:59:59.999Z',
        },
        patterns: [
          {
            mood: 'happy',
            frequency: 15,
            averageIntensity: 7,
            commonTriggers: ['good news', 'exercise', 'social interaction'],
            timeOfDay: 'Morning (6AM-12PM)',
            dayOfWeek: 'Friday',
            averageDuration: 120,
          },
        ],
        trends: [
          {
            period: 'Period 1',
            averageMood: 'happy',
            moodStability: 0.8,
            intensityTrend: 'stable',
            topMoods: [{ mood: 'happy', count: 15 }],
          },
        ],
        recommendations: [
          'High intensity happy moods are frequent. Consider stress management techniques.',
          'Common triggers for happy moods: good news, exercise, social interaction. Consider maintaining these positive activities.',
        ],
      },
    },
  });

export const MoodPatternsResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Mood patterns retrieved successfully',
    schema: {
      example: [
        {
          mood: 'happy',
          frequency: 15,
          averageIntensity: 7,
          commonTriggers: ['good news', 'exercise'],
          timeOfDay: 'Morning (6AM-12PM)',
          dayOfWeek: 'Friday',
          averageDuration: 120,
        },
      ],
    },
  });

export const ContentInteractionAnalysisResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Content interaction analysis retrieved successfully',
    schema: {
      example: {
        totalInteractions: 67,
        interactionsByMood: [
          { mood: 'happy', count: 25, percentage: 37 },
          { mood: 'calm', count: 20, percentage: 30 },
        ],
        interactionsByType: [
          { type: 'like', count: 40, percentage: 60 },
          { type: 'save', count: 27, percentage: 40 },
        ],
        moodContentCorrelation: [
          {
            mood: 'happy',
            preferredContentTypes: ['music', 'movies'],
            averageRating: 8.5,
          },
        ],
      },
    },
  });

export const ContentRecommendationsResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Content recommendations based on mood retrieved successfully',
    schema: {
      example: {
        recommendedContentTypes: ['music', 'movies', 'books'],
        moodBasedPreferences: [
          {
            contentType: 'music',
            confidence: 0.9,
            reason: 'Based on your happy mood interactions (avg rating: 8.5)',
          },
        ],
        interactionInsights: [
          'You experience happy moods frequently (15 times)',
        ],
      },
    },
  });

export const ExportResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Mood history exported successfully',
    schema: {
      example: {
        userId: 123,
        exportDate: '2024-01-30T10:30:00.000Z',
        dateRange: {
          start: '2024-01-01T00:00:00.000Z',
          end: '2024-01-30T23:59:59.999Z',
        },
        totalEntries: 45,
        data: [
          {
            id: 1,
            feeling: 'happy',
            intensity: 7,
            context: 'Completed a project',
            triggers: ['achievement', 'recognition'],
            notes: 'Feeling accomplished',
            createdAt: '2024-01-30T09:00:00.000Z',
          },
        ],
      },
    },
  });

export const HealthCheckResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Mood history service health check',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2024-01-30T10:30:00.000Z',
        service: 'mood-history-service',
      },
    },
  });

export const BadRequestResponse = () =>
  ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters',
    schema: {
      example: {
        message: 'Validation failed',
        statusCode: 400,
        error: 'Bad Request',
      },
    },
  });

export const UnauthorizedResponse = () =>
  ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
        error: 'Unauthorized',
      },
    },
  });

export const InternalServerErrorResponse = () =>
  ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        statusCode: 500,
        error: 'Internal Server Error',
      },
    },
  });
