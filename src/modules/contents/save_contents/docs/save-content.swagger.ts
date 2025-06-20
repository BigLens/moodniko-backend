import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

const exampleSavedContent = {
  id: 1,
  contentId: 42,
  mood: 'happy',
  createdAt: '2024-06-01T12:00:00.000Z',
  content: {
    id: 42,
    externalId: 'tt1234567',
    title: 'Example Movie',
    description: 'A sample description.',
    imageUrl: 'https://example.com/image.jpg',
    type: 'movie',
    moodtag: 'happy',
    createdAt: '2024-06-01T10:00:00.000Z',
    updatedAt: '2024-06-01T11:00:00.000Z',
  },
};

export const SavedContentApiTags = () =>
  applyDecorators(ApiTags('Saved Contents'));

export const SaveContentDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Save content for a mood',
      description:
        'Saves a content item for a specific mood. Fails if already saved with the same mood or if the content does not exist.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          contentId: { type: 'number', example: 42 },
          mood: { type: 'string', example: 'happy', maxLength: 50 },
        },
        required: ['contentId', 'mood'],
      },
      examples: {
        valid: {
          summary: 'Valid request',
          value: { contentId: 42, mood: 'happy' },
        },
        tooLongMood: {
          summary: 'Mood too long',
          value: { contentId: 42, mood: 'a'.repeat(51) },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Content saved successfully',
      schema: { type: 'object', example: exampleSavedContent },
    }),
    ApiResponse({
      status: 400,
      description:
        'Bad Request - Mood too long or content already saved with this mood',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'string',
            example: 'Mood must be 50 characters or less',
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Content not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Content not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );

export const GetSavedContentsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all saved contents',
      description:
        'Retrieves all saved content items, ordered by creation date (most recent first). Supports optional filtering by mood and contentId.',
    }),
    ApiQuery({
      name: 'mood',
      required: false,
      type: String,
      description: 'Filter saved contents by mood',
      example: 'happy',
    }),
    ApiQuery({
      name: 'contentId',
      required: false,
      type: Number,
      description: 'Filter saved contents by contentId',
      example: 42,
    }),
    ApiResponse({
      status: 200,
      description: 'List of saved contents',
      schema: {
        type: 'array',
        items: { type: 'object', example: exampleSavedContent },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );

export const GetSavedContentByIdDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get a saved content by id',
      description: 'Retrieves a single saved content item by its unique id.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The unique id of the saved content',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Saved content found',
      schema: { type: 'object', example: exampleSavedContent },
    }),
    ApiResponse({
      status: 404,
      description: 'Saved content not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Saved content not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );

export const RemoveSavedContentDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Remove saved content',
      description:
        'Removes a saved content item by contentId. Returns 200 with a message if deleted, 404 if not found.',
    }),
    ApiParam({
      name: 'contentId',
      type: 'number',
      description: 'The ID of the content to unsave',
      example: 42,
    }),
    ApiResponse({
      status: 200,
      description: 'Resource deleted',
      schema: {
        type: 'object',
        example: { message: 'Resource deleted' },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Fail deletion because the resource does not exist.',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example: 'Fail deletion because the resource does not exist',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );

export const RemoveSavedContentByIdDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Remove saved content by unique id',
      description:
        'Removes a saved content item by its unique id (primary key). Returns 200 with a message if deleted, 404 if not found.',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'The unique id of the saved content to unsave',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Resource deleted',
      schema: {
        type: 'object',
        example: { message: 'Resource deleted' },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Fail deletion because the resource does not exist.',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example: 'Fail deletion because the resource does not exist',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
