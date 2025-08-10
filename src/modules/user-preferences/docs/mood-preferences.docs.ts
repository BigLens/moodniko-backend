import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

export function GetMoodPreferencesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get mood-specific preferences',
      description:
        'Retrieve mood-specific preferences for the authenticated user. If a mood is specified, returns preferences for that specific mood only.',
    }),
    ApiQuery({
      name: 'mood',
      required: false,
      description: 'Specific mood to get preferences for',
    }),
    ApiResponse({
      status: 200,
      description: 'Mood preferences retrieved successfully',
      schema: {
        example: {
          moodPreferences: {
            happy: {
              intensityLevels: [1, 2, 3, 4, 5],
              preferredContentTypes: ['movie', 'music'],
              customCategories: ['uplifting'],
              defaultPreferences: {
                contentTypes: ['comedy', 'pop'],
                intensityThreshold: 3,
              },
            },
          },
          moodIntensitySettings: {
            happy: {
              minIntensity: 1,
              maxIntensity: 5,
              contentMappings: {
                movie: { minIntensity: 1, maxIntensity: 5, priority: 1 },
                music: { minIntensity: 1, maxIntensity: 5, priority: 2 },
              },
            },
          },
          customMoodCategories: ['uplifting', 'energetic'],
          defaultIntensityLevels: 5,
          enableMoodIntensity: true,
          enableCustomMoodCategories: true,
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

export function UpdateMoodPreferencesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update (upsert) mood-specific preferences',
      description:
        'Upsert mood-specific preferences for the authenticated user. If preferences for the given mood do not exist, they will be created; otherwise they will be updated. You can also update general mood settings without specifying a mood.',
    }),
    ApiBody({
      description:
        'Either provide a specific mood and its preferences, intensity settings, or provide general settings toggles.',
      schema: {
        oneOf: [
          {
            type: 'object',
            required: ['mood', 'moodPreference'],
            properties: {
              mood: { type: 'string', example: 'happy' },
              moodPreference: {
                type: 'object',
                properties: {
                  intensityLevels: {
                    type: 'array',
                    items: { type: 'number' },
                    example: [1, 2, 3, 4, 5],
                  },
                  preferredContentTypes: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['comedy', 'pop'],
                  },
                  customCategories: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['uplifting'],
                  },
                  defaultPreferences: {
                    type: 'object',
                    properties: {
                      contentTypes: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['comedy', 'pop'],
                      },
                      intensityThreshold: { type: 'number', example: 3 },
                    },
                  },
                },
              },
              intensitySettings: {
                type: 'object',
                properties: {
                  minIntensity: { type: 'number', example: 1 },
                  maxIntensity: { type: 'number', example: 5 },
                  contentMappings: {
                    type: 'object',
                    additionalProperties: {
                      type: 'object',
                      properties: {
                        minIntensity: { type: 'number', example: 1 },
                        maxIntensity: { type: 'number', example: 5 },
                        priority: { type: 'number', example: 1 },
                      },
                    },
                    example: {
                      comedy: { minIntensity: 1, maxIntensity: 5, priority: 1 },
                      pop: { minIntensity: 1, maxIntensity: 5, priority: 2 },
                    },
                  },
                },
              },
            },
          },
          {
            type: 'object',
            properties: {
              defaultIntensityLevels: { type: 'number', example: 10 },
              enableMoodIntensity: { type: 'boolean', example: true },
              enableCustomMoodCategories: { type: 'boolean', example: true },
              customMoodCategories: {
                type: 'array',
                items: { type: 'string' },
                example: ['energetic', 'calm', 'focused'],
              },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Mood preferences updated successfully',
      schema: {
        example: {
          id: 1,
          theme: 'light',
          notificationsEnabled: true,
          preferredContentTypes: ['movie', 'music'],
          moodPreferences: {
            happy: {
              intensityLevels: [1, 2, 3, 4, 5],
              preferredContentTypes: ['comedy', 'pop'],
              customCategories: ['uplifting'],
              defaultPreferences: {
                contentTypes: ['comedy', 'pop'],
                intensityThreshold: 3,
              },
            },
          },
          moodIntensitySettings: {
            happy: {
              minIntensity: 1,
              maxIntensity: 5,
              contentMappings: {
                comedy: { minIntensity: 1, maxIntensity: 5, priority: 1 },
                pop: { minIntensity: 1, maxIntensity: 5, priority: 2 },
              },
            },
          },
          customMoodCategories: ['uplifting'],
          defaultIntensityLevels: 5,
          enableMoodIntensity: true,
          enableCustomMoodCategories: true,
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
          message: ['Invalid mood preference data'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function CreateCustomMoodCategoryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create custom mood category',
      description:
        'Create a new custom mood category for the authenticated user',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['categoryName'],
        properties: {
          categoryName: { type: 'string', example: 'energetic' },
          description: { type: 'string', example: 'High energy moods' },
          relatedMoods: {
            type: 'array',
            items: { type: 'string' },
            example: ['happy', 'excited', 'motivated'],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Custom mood category created successfully',
      schema: {
        example: {
          id: 1,
          customMoodCategories: ['uplifting', 'energetic', 'new-category'],
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
      description: 'Category already exists or invalid input',
      schema: {
        example: {
          statusCode: 400,
          message: 'Mood category already exists',
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function DeleteCustomMoodCategoryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete custom mood category',
      description: 'Delete a custom mood category for the authenticated user',
    }),
    ApiParam({
      name: 'categoryName',
      description: 'Name of the category to delete',
    }),
    ApiResponse({
      status: 200,
      description: 'Custom mood category deleted successfully',
      schema: {
        example: {
          id: 1,
          customMoodCategories: ['uplifting', 'energetic'],
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
      description: 'Category not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Category not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function GetContentRecommendationsForMoodDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get content recommendations for mood',
      description:
        'Get personalized content recommendations based on mood and intensity level',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['mood', 'intensity'],
        properties: {
          mood: { type: 'string', example: 'happy' },
          intensity: { type: 'number', example: 4 },
          preferredContentTypes: {
            type: 'array',
            items: { type: 'string' },
            example: ['comedy', 'pop'],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Content recommendations retrieved successfully',
      schema: {
        example: {
          contentTypes: ['comedy', 'pop'],
          intensity: 4,
          mood: 'happy',
          isDefault: false,
          moodPreferences: {
            intensityLevels: [1, 2, 3, 4, 5],
            preferredContentTypes: ['comedy', 'pop'],
            customCategories: ['uplifting'],
            defaultPreferences: {
              contentTypes: ['comedy', 'pop'],
              intensityThreshold: 3,
            },
          },
          intensitySettings: {
            minIntensity: 1,
            maxIntensity: 5,
            contentMappings: {
              comedy: { minIntensity: 1, maxIntensity: 5, priority: 1 },
              pop: { minIntensity: 1, maxIntensity: 5, priority: 2 },
            },
          },
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

export function ResetMoodPreferencesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset mood preferences',
      description:
        "Reset mood preferences for the authenticated user. If a mood is specified, only that mood's preferences are reset.",
    }),
    ApiQuery({
      name: 'mood',
      required: false,
      description: 'Specific mood to reset preferences for',
    }),
    ApiResponse({
      status: 200,
      description: 'Mood preferences reset successfully',
      schema: {
        example: {
          id: 1,
          theme: 'light',
          notificationsEnabled: true,
          preferredContentTypes: ['movie', 'music'],
          moodPreferences: {},
          moodIntensitySettings: {},
          customMoodCategories: [],
          defaultIntensityLevels: 5,
          enableMoodIntensity: true,
          enableCustomMoodCategories: true,
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
