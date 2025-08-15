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

export class CreateMoodDto {
  @ApiProperty({
    description: 'The mood feeling/emotion',
    example: 'happy',
    enum: [
      'happy',
      'sad',
      'energetic',
      'calm',
      'stressed',
      'anxious',
      'excited',
      'tired',
      'focused',
      'relaxed',
      'neutral',
    ],
  })
  @IsString()
  @IsIn([
    'happy',
    'sad',
    'energetic',
    'calm',
    'stressed',
    'anxious',
    'excited',
    'tired',
    'focused',
    'relaxed',
    'neutral',
  ])
  feeling: string;

  @ApiPropertyOptional({
    description: 'Intensity level of the mood (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  intensity?: number;

  @ApiPropertyOptional({
    description: 'Context or situation when the mood occurred',
    example: 'Working on a challenging project',
  })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiPropertyOptional({
    description: 'Triggers that caused this mood',
    example: ['work stress', 'lack of sleep', 'good news'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  triggers?: string[];

  @ApiPropertyOptional({
    description: 'Additional notes about the mood',
    example: 'Feeling overwhelmed but also accomplished',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Location where the mood occurred',
    example: 'Home office',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Weather conditions when the mood occurred',
    example: 'Sunny',
  })
  @IsOptional()
  @IsString()
  weather?: string;

  @ApiPropertyOptional({
    description: 'Activity being performed when the mood occurred',
    example: 'Working',
  })
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiPropertyOptional({
    description: 'Social context when the mood occurred',
    example: 'Alone',
    enum: [
      'alone',
      'with family',
      'with friends',
      'at work',
      'in public',
      'online',
    ],
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'alone',
    'with family',
    'with friends',
    'at work',
    'in public',
    'online',
  ])
  socialContext?: string;

  @ApiPropertyOptional({
    description: 'Energy level (1-10)',
    example: 6,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  energyLevel?: number;

  @ApiPropertyOptional({
    description: 'Stress level (1-10)',
    example: 4,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  stressLevel?: number;

  @ApiPropertyOptional({
    description: 'Sleep quality from previous night (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  sleepQuality?: number;

  @ApiPropertyOptional({
    description: 'Duration of the mood in minutes',
    example: 120,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  moodDurationMinutes?: number;

  @ApiPropertyOptional({
    description: 'Reason for mood change',
    example: 'Completed a difficult task',
  })
  @IsOptional()
  @IsString()
  moodChangeReason?: string;
}
