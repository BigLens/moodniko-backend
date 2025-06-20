import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const HealthApiTags = () => applyDecorators(ApiTags('health'));

export const GetHealthDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Health check',
      description:
        'Returns the health status of the API. Used for uptime monitoring and readiness checks.',
    }),
    ApiResponse({
      status: 200,
      description: 'API is healthy',
      schema: {
        type: 'object',
        example: { status: 'ok' },
      },
    }),
  );

export const GetReadinessDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Readiness check',
      description:
        'Checks if the application is ready to receive traffic (e.g., database is connected).',
    }),
    ApiResponse({
      status: 200,
      description: 'Application is ready or not ready',
      schema: {
        type: 'object',
        examples: {
          ready: { value: { status: 'ready' } },
          notReady: {
            value: {
              status: 'not ready',
              reason: 'database connection failed',
            },
          },
        },
      },
    }),
  );

export const GetLivenessDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Liveness check',
      description: 'Checks if the application process is running.',
    }),
    ApiResponse({
      status: 200,
      description: 'Application is alive',
      schema: {
        type: 'object',
        example: { status: 'alive', timestamp: '2024-06-20T12:00:00.000Z' },
      },
    }),
  );
