import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function UserPreferencesApiTags() {
  return ApiTags('user-preferences');
}

export function GetUserPreferencesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user preferences',
      description: 'Retrieve user preferences for the authenticated user',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: 200,
      description: 'User preferences retrieved successfully',
      schema: {
        example: {
          id: 1,
          theme: 'light',
          notificationsEnabled: true,
          preferredContentTypes: ['movie', 'music'],
          userId: 1,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User preferences not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'User preferences not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function UpdateUserPreferencesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user preferences',
      description: 'Update user preferences for the authenticated user',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            example: 'dark',
            description: 'User theme preference (light/dark)',
            enum: ['light', 'dark'],
          },
          notificationsEnabled: {
            type: 'boolean',
            example: true,
            description: 'Whether notifications are enabled',
          },
          preferredContentTypes: {
            type: 'array',
            items: { type: 'string' },
            example: ['movie', 'music', 'book'],
            description: 'Array of preferred content types',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'User preferences updated successfully',
      schema: {
        example: {
          id: 1,
          theme: 'dark',
          notificationsEnabled: false,
          preferredContentTypes: ['movie', 'music'],
          userId: 1,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T11:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['theme must be one of the following values: light, dark'],
          error: 'Bad Request',
        },
      },
    }),
  );
}
