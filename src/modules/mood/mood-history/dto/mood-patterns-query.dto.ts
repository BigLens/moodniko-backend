import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class MoodPatternsQueryDto {
  @ApiPropertyOptional({
    description: 'Time period for pattern analysis',
    example: 'month',
    enum: ['day', 'week', 'month', 'year'],
  })
  @IsOptional()
  @IsIn(['day', 'week', 'month', 'year'])
  period?: 'day' | 'week' | 'month' | 'year' = 'month';
}
