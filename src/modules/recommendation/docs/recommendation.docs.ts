import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const RecommendationApiTags = () => ApiTags('recommendations');

export const GenerateRecommendationsDocs = () =>
  ApiOperation({
    summary: 'Generate personalized content recommendations',
    description:
      'Generate personalized content recommendations based on user mood, preferences, and historical data.',
  });

export const GetQualityMetricsDocs = () =>
  ApiOperation({
    summary: 'Get recommendation quality metrics',
    description:
      'Retrieve recommendation quality metrics and performance analytics for the authenticated user.',
  });

export const HealthCheckDocs = () =>
  ApiOperation({
    summary: 'Recommendation service health check',
    description: 'Check the health status of the recommendation service.',
  });

// Response decorators
export const GenerateRecommendationsResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Recommendations generated successfully',
    schema: {
      example: [
        {
          id: 'content-123',
          title: 'Happy Playlist',
          type: 'music',
          mood: 'happy',
          intensity: 7,
          confidence: 0.85,
          reason: 'Matches your mood preferences and historical patterns',
        },
        {
          id: 'content-456',
          title: 'Feel Good Movie',
          type: 'movies',
          mood: 'happy',
          intensity: 7,
          confidence: 0.78,
          reason: 'Based on your frequent happy mood patterns',
        },
      ],
    },
  });

export const QualityMetricsResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Quality metrics retrieved successfully',
    schema: {
      example: {
        totalRecommendations: 150,
        acceptedRecommendations: 127,
        rejectedRecommendations: 23,
        averageConfidence: 0.78,
        userSatisfaction: 0.84,
        moodStability: 0.72,
        totalMoodEntries: 45,
        patternsIdentified: 8,
        trendsAnalyzed: 6,
      },
    },
  });

export const HealthCheckResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Recommendation service health check',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2024-01-30T10:30:00.000Z',
        service: 'recommendation-engine',
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
        message: 'Failed to generate recommendations',
        statusCode: 500,
        error: 'Internal Server Error',
      },
    },
  });
