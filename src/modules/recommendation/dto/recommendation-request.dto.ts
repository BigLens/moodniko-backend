import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class RecommendationRequestDto {
  @ApiProperty({
    description: 'Current mood of the user',
    example: 'happy',
    enum: ['happy', 'sad', 'energetic', 'calm', 'stressed', 'neutral'],
  })
  @IsString()
  currentMood: string;

  @ApiPropertyOptional({
    description: 'Intensity level of the current mood (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  moodIntensity?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of recommendations to return',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Specific content types to filter recommendations',
    example: ['music', 'movies'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentTypes?: string[];
}
