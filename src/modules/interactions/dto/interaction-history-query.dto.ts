import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InteractionType } from '../interfaces/interactions.interface';

export class InteractionHistoryQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    default: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of results to skip for pagination',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ description: 'Filter by interaction type' })
  @IsOptional()
  @IsEnum(InteractionType)
  interactionType?: InteractionType;

  @ApiPropertyOptional({ description: 'Start date for filtering (ISO string)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering (ISO string)' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
