import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { MoodDto } from '../dto/mood.dto';

export function MoodApiTags() {
  return ApiTags('moods');
}

export function CreateMoodDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new mood entry',
      description:
        "Create a new mood entry for the authenticated user. The feeling field is required and should be a string describing the user's current mood.",
    }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      type: MoodDto,
      description: 'Mood data to create',
      examples: {
        happy: {
          summary: 'Happy mood',
          value: {
            feeling: 'happy',
          },
        },
        sad: {
          summary: 'Sad mood',
          value: {
            feeling: 'sad',
          },
        },
        excited: {
          summary: 'Excited mood',
          value: {
            feeling: 'excited',
          },
        },
        calm: {
          summary: 'Calm mood',
          value: {
            feeling: 'calm',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          feeling: {
            type: 'string',
            description: "The user's current mood feeling",
            example: 'happy',
            enum: [
              'happy',
              'sad',
              'excited',
              'calm',
              'anxious',
              'energetic',
              'tired',
              'focused',
              'relaxed',
              'stressed',
            ],
          },
        },
        required: ['feeling'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Mood created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          feeling: { type: 'string', example: 'happy' },
          userId: { type: 'number', example: 1 },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
        },
        example: {
          id: 1,
          feeling: 'happy',
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
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
        },
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
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'feeling should not be empty',
              'feeling must be a string',
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
        },
        example: {
          statusCode: 400,
          message: ['feeling should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function GetAllMoodsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all moods for authenticated user',
      description:
        'Retrieve all mood entries for the currently authenticated user, ordered by creation date (newest first). No request body required.',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: 200,
      description: 'List of user moods retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            feeling: { type: 'string', example: 'happy' },
            userId: { type: 'number', example: 1 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
        },
        example: [
          {
            id: 1,
            feeling: 'happy',
            userId: 1,
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
          },
          {
            id: 2,
            feeling: 'sad',
            userId: 1,
            createdAt: '2024-01-14T15:45:00.000Z',
            updatedAt: '2024-01-14T15:45:00.000Z',
          },
          {
            id: 3,
            feeling: 'excited',
            userId: 1,
            createdAt: '2024-01-13T09:20:00.000Z',
            updatedAt: '2024-01-13T09:20:00.000Z',
          },
        ],
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
        },
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
  );
}

export function GetMoodByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get mood by ID',
      description:
        'Retrieve a specific mood entry by ID for the authenticated user. Only returns moods that belong to the authenticated user. No request body required.',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'id',
      description: 'Mood entry ID',
      type: 'number',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Mood found successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          feeling: { type: 'string', example: 'happy' },
          userId: { type: 'number', example: 1 },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
        },
        example: {
          id: 1,
          feeling: 'happy',
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
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
        },
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Mood not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Mood not found' },
          error: { type: 'string', example: 'Not Found' },
        },
        example: {
          statusCode: 404,
          message: 'Mood not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function UpdateMoodDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update mood by ID',
      description:
        'Update a specific mood entry by ID for the authenticated user. Only allows updating moods that belong to the authenticated user.',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'id',
      description: 'Mood entry ID',
      type: 'number',
      example: 1,
    }),
    ApiBody({
      type: MoodDto,
      description: 'Updated mood data',
      examples: {
        excited: {
          summary: 'Update to excited mood',
          value: {
            feeling: 'excited',
          },
        },
        calm: {
          summary: 'Update to calm mood',
          value: {
            feeling: 'calm',
          },
        },
        sad: {
          summary: 'Update to sad mood',
          value: {
            feeling: 'sad',
          },
        },
        happy: {
          summary: 'Update to happy mood',
          value: {
            feeling: 'happy',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          feeling: {
            type: 'string',
            description: 'The updated mood feeling',
            example: 'excited',
            enum: [
              'happy',
              'sad',
              'excited',
              'calm',
              'anxious',
              'energetic',
              'tired',
              'focused',
              'relaxed',
              'stressed',
            ],
          },
        },
        required: ['feeling'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Mood updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          feeling: { type: 'string', example: 'excited' },
          userId: { type: 'number', example: 1 },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T11:00:00.000Z',
          },
        },
        example: {
          id: 1,
          feeling: 'excited',
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
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
        },
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Mood not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Mood not found' },
          error: { type: 'string', example: 'Not Found' },
        },
        example: {
          statusCode: 404,
          message: 'Mood not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'feeling should not be empty',
              'feeling must be a string',
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
        },
        example: {
          statusCode: 400,
          message: ['feeling should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function DeleteMoodDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete mood by ID',
      description:
        'Delete a specific mood entry by ID for the authenticated user. Only allows deleting moods that belong to the authenticated user. No request body required.',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'id',
      description: 'Mood entry ID',
      type: 'number',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Mood deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Mood deleted successfully' },
        },
        example: {
          message: 'Mood deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
        },
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Mood not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Mood not found' },
          error: { type: 'string', example: 'Not Found' },
        },
        example: {
          statusCode: 404,
          message: 'Mood not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
