import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

export const ApiGetBooksByMood = () => {
  return applyDecorators(
    ApiTags('Books'),
    ApiOperation({
      summary: 'Get book recommendations based on mood',
      description: `Retrieves a list of books that can help users achieve a better emotional state based on their current mood.
      The API maps moods to appropriate book genres and themes that can help users feel better.
      For example:
      - When a user is sad, they'll get uplifting and motivational books
      - When a user is angry, they'll get calming and mindfulness books
      - When a user is anxious, they'll get relaxing and meditation books`,
    }),
    ApiQuery({
      name: 'mood',
      description: 'The current mood of the user',
      type: 'string',
      enum: [
        'happy',
        'excited',
        'inspired',
        'peaceful',
        'sad',
        'moody',
        'anxious',
        'stressed',
        'bored',
        'lonely',
        'angry',
        'tired',
        'confused',
        'scared',
      ],
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved book recommendations',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'OL45804W',
                },
                title: {
                  type: 'string',
                  example: 'The Alchemist',
                },
                author: {
                  type: 'string',
                  example: 'Paulo Coelho',
                },
                cover: {
                  type: 'string',
                  example: 'https://covers.openlibrary.org/b/id/1234567-L.jpg',
                },
                description: {
                  type: 'string',
                  example: 'A philosophical novel about following your dreams.',
                },
                rating: {
                  type: 'number',
                  example: 4.5,
                },
                genres: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  example: ['Fiction', 'Philosophy', 'Self-help'],
                },
                publishedYear: {
                  type: 'number',
                  example: 1988,
                },
                pages: {
                  type: 'number',
                  example: 208,
                },
                language: {
                  type: 'string',
                  example: 'English',
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid mood parameter',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Mood parameter is required',
              },
              code: {
                type: 'string',
                example: 'INVALID_MOOD',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'No books found for the given mood',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'No books found for the given mood',
              },
              code: {
                type: 'string',
                example: 'NO_BOOKS_FOUND',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal server error',
              },
              code: {
                type: 'string',
                example: 'INTERNAL_SERVER_ERROR',
              },
            },
          },
        },
      },
    }),
  );
};
