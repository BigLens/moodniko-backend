import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('MoodNiko API Documentation')
    .setDescription(
      'Mood-based content recommendation APIs for movies, music, podcasts, and books. ' +
        'This API uses JWT authentication for user-specific endpoints. ' +
        'For detailed authentication instructions, see the authentication guide in the docs folder.',
    )
    .setVersion('1.0')
    .addTag('auth', 'User authentication and registration')
    .addTag('contents', 'Content management and recommendations')
    .addTag('Books', 'Book recommendations')
    .addTag('Movies', 'Movie recommendations')
    .addTag('Spotify', 'Spotify music and podcast recommendations')
    .addTag(
      'Saved Contents',
      'User saved content operations (requires authentication)',
    )
    .addTag('moods', 'User mood management (requires authentication)')
    .addTag(
      'mood-history',
      'Mood history analysis and tracking (requires authentication)',
    )
    .addTag(
      'recommendations',
      'Content recommendations based on mood and preferences',
    )
    .addTag(
      'interactions',
      'Content interaction tracking and analysis (requires authentication)',
    )
    .addTag(
      'user-preferences',
      'User preferences management (requires authentication)',
    )
    .addTag('health', 'Health check endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT token obtained from login or registration. Include as: Bearer <token>',
      },
      'JWT-auth',
    )
    .build();
}
