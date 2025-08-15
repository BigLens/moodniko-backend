import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ExportQueryDto {
  @ApiPropertyOptional({
    description: 'Export format (default: json)',
    example: 'json',
    enum: ['json', 'csv'],
  })
  @IsOptional()
  @IsIn(['json', 'csv'])
  format?: 'json' | 'csv' = 'json';

  @ApiPropertyOptional({
    description: 'Number of days to export (default: 365, max: 365)',
    example: 365,
    minimum: 1,
    maximum: 365,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number = 365;
}
