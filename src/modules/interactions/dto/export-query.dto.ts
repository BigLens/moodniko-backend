import { IsEnum, IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExportQueryDto {
  @ApiProperty({
    description: 'Export format',
    enum: ['json', 'csv'],
    example: 'json',
  })
  @IsEnum(['json', 'csv'])
  format: 'json' | 'csv';

  @ApiPropertyOptional({ description: 'Start date for filtering (ISO string)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering (ISO string)' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Include mood data in export',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeMoodData?: boolean;
}
