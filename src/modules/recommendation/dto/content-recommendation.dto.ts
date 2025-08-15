import { ApiProperty } from '@nestjs/swagger';

export class ContentRecommendationDto {
  @ApiProperty({
    description: 'Unique identifier for the content',
    example: 'content-123',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the recommended content',
    example: 'Happy Playlist',
  })
  title: string;

  @ApiProperty({
    description: 'Type of content',
    example: 'music',
    enum: ['music', 'movies', 'books', 'podcasts', 'articles'],
  })
  type: string;

  @ApiProperty({
    description: 'Mood for which this content is recommended',
    example: 'happy',
  })
  mood: string;

  @ApiProperty({
    description: 'Intensity level of the mood (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  intensity: number;

  @ApiProperty({
    description: 'Confidence score for this recommendation (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;

  @ApiProperty({
    description: 'Reason why this content was recommended',
    example: 'Matches your mood preferences',
  })
  reason: string;
}
