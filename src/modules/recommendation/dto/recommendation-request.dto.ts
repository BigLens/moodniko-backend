import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendationRequestDto {
  @ApiProperty({
    description: 'Current mood of the user',
    example: 'happy',
    enum: ['happy', 'sad', 'energetic', 'calm', 'stressed', 'neutral'],
  })
  @IsString()
  @IsIn(['happy', 'sad', 'energetic', 'calm', 'stressed', 'neutral'])
  currentMood: string;

  @ApiPropertyOptional({
    description: 'Intensity level of the current mood (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  moodIntensity?: number = 5;

  @ApiPropertyOptional({
    description: 'Maximum number of recommendations to return',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;

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
