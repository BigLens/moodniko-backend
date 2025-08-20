import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InteractionType } from '../interfaces/interactions.interface';

export class TrackInteractionDto {
  @ApiProperty({ description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Content ID' })
  @IsString()
  contentId: string;

  @ApiProperty({
    description: 'Type of interaction',
    enum: InteractionType,
  })
  @IsEnum(InteractionType)
  interactionType: InteractionType;

  @ApiPropertyOptional({ description: 'Interaction value (e.g., rating 1-5)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  interactionValue?: number;

  @ApiPropertyOptional({ description: 'User mood at time of interaction' })
  @IsOptional()
  @IsString()
  moodAtInteraction?: string;

  @ApiPropertyOptional({ description: 'Mood intensity (1-10)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  moodIntensityAtInteraction?: number;

  @ApiPropertyOptional({ description: 'Duration of interaction in seconds' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  interactionDurationSeconds?: number;

  @ApiPropertyOptional({ description: 'Context of the interaction' })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
