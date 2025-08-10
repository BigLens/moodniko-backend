import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentRecommendationDto } from '../dto/content-recommendation.dto';

export const RecommendationApiTags = () => applyDecorators(ApiTags('Recommendations'));

export const GenerateRecommendationsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Generate personalized content recommendations',
      description: 'Generate content recommendations based on user mood and preferences',
    }),
    ApiResponse({
      status: 200,
      description: 'Recommendations generated successfully',
      type: [ContentRecommendationDto],
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid request parameters',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
    }),
  );

export const GetQualityMetricsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get recommendation quality metrics',
      description: 'Retrieve metrics about recommendation quality and user satisfaction',
    }),
    ApiResponse({
      status: 200,
      description: 'Quality metrics retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          totalRecommendations: { type: 'number' },
          acceptedRecommendations: { type: 'number' },
          rejectedRecommendations: { type: 'number' },
          averageConfidence: { type: 'number' },
          userSatisfaction: { type: 'number' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
    }),
  );

export const HealthCheckDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Recommendation service health check',
      description: 'Check if the recommendation service is functioning properly',
    }),
    ApiResponse({
      status: 200,
      description: 'Service is healthy',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          timestamp: { type: 'string' },
          service: { type: 'string' },
        },
      },
    }),
  );
