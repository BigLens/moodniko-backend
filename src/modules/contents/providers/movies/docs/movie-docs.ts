import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

const exampleMovieResponse = {
  id: '550',
  title: 'Fight Club',
  type: 'movie',
  moodtag: 'excited',
  description:
    'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
  imageUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  externalId: 'tt0137523',
  rating: 8.4,
  releaseDate: '1999-10-15',
  metadata: {
    director: 'David Fincher',
    genres: ['Drama'],
    runtime: 139,
    language: 'en',
    voteCount: 24371,
  },
};

export const MovieApiTags = () => applyDecorators(ApiTags('Movies'));

export const GetMoviesByMoodDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get movies by mood',
      description:
        'Fetches a list of movies that match the specified mood. The movies are fetched from TMDB API and filtered based on the mood criteria.',
    }),
    ApiQuery({
      name: 'mood',
      required: true,
      type: String,
      description:
        'The mood to search movies for. Each mood is mapped to specific movie genres for better results.',
      example: 'excited',
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
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved movies for the specified mood',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: exampleMovieResponse.id },
            title: { type: 'string', example: exampleMovieResponse.title },
            type: { type: 'string', example: exampleMovieResponse.type },
            moodtag: { type: 'string', example: exampleMovieResponse.moodtag },
            description: {
              type: 'string',
              example: exampleMovieResponse.description,
            },
            imageUrl: {
              type: 'string',
              example: exampleMovieResponse.imageUrl,
            },
            externalId: {
              type: 'string',
              example: exampleMovieResponse.externalId,
            },
            rating: { type: 'number', example: exampleMovieResponse.rating },
            releaseDate: {
              type: 'string',
              example: exampleMovieResponse.releaseDate,
            },
            metadata: {
              type: 'object',
              properties: {
                director: {
                  type: 'string',
                  example: exampleMovieResponse.metadata.director,
                },
                genres: {
                  type: 'array',
                  items: { type: 'string' },
                  example: exampleMovieResponse.metadata.genres,
                },
                runtime: {
                  type: 'number',
                  example: exampleMovieResponse.metadata.runtime,
                },
                language: {
                  type: 'string',
                  example: exampleMovieResponse.metadata.language,
                },
                voteCount: {
                  type: 'number',
                  example: exampleMovieResponse.metadata.voteCount,
                },
              },
            },
          },
        },
        example: [exampleMovieResponse],
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid or missing mood parameter',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Mood parameter is required' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - TMDB API error or configuration issue',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: {
            type: 'string',
            example: 'Failed to fetch movies from TMDB API',
          },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );
};
