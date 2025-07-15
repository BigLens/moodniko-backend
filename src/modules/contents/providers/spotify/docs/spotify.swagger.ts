import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpotifyContentType } from '@modules/contents/providers/spotify/enum/spotify-content.enum';

export const ApiSpotifyContent = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiTags('Spotify')(target, propertyKey, descriptor);
    ApiOperation({
      summary: 'Get Spotify content by mood',
      description:
        'Retrieves music tracks and/or podcasts from Spotify based on the specified mood and content type.',
    })(target, propertyKey, descriptor);
    ApiQuery({
      name: 'mood',
      required: true,
      description:
        'The mood to search content for (e.g., happy, sad, energetic)',
      type: String,
    })(target, propertyKey, descriptor);
    ApiQuery({
      name: 'contentType',
      required: false,
      description: 'Filter content by type (music, podcast, or both)',
      enum: SpotifyContentType,
      isArray: false,
      example: SpotifyContentType.BOTH,
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved Spotify content',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1234567890' },
            title: { type: 'string', example: 'Shape of You' },
            artist: { type: 'string', example: 'Ed Sheeran' },
            type: {
              type: 'string',
              enum: Object.values(SpotifyContentType),
              example: SpotifyContentType.MUSIC,
            },
            url: {
              type: 'string',
              example: 'https://open.spotify.com/track/1234567890',
            },
            thumbnailUrl: {
              type: 'string',
              example: 'https://i.scdn.co/image/1234567890',
            },
            duration: { type: 'number', example: 235000 },
            mood: { type: 'string', example: 'happy' },
            metadata: {
              type: 'object',
              example: {
                album: '÷ (Divide)',
                releaseDate: '2017-03-03',
                popularity: 95,
              },
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid mood parameter',
    })(target, propertyKey, descriptor);
    ApiResponse({
      status: 500,
      description: 'Internal server error',
    })(target, propertyKey, descriptor);
  };
};
