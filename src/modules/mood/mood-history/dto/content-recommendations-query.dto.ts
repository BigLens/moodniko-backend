import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ContentRecommendationsQueryDto {
  @ApiProperty({
    description: 'Current mood for content recommendations',
    example: 'happy',
  })
  @IsString()
  currentMood: string;

  @ApiPropertyOptional({
    description:
      'Number of days to analyze for recommendations (default: 30, max: 365)',
    example: 30,
    minimum: 1,
    maximum: 365,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number = 30;
}
