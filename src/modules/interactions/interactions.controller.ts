import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { TrackInteractionDto } from './dto/track-interaction.dto';
import { InteractionHistoryQueryDto } from './dto/interaction-history-query.dto';
import { ExportQueryDto } from './dto/export-query.dto';
import {
  ApiTagsInteractions,
  ApiTrackInteraction,
  ApiTrackInteractionResponse,
  ApiGetUserInteractionHistory,
  ApiGetUserInteractionHistoryResponse,
  ApiGetUserInteractionHistoryParam,
  ApiGetUserInteractionHistoryQuery,
  ApiAnalyzeInteractionPatterns,
  ApiAnalyzeInteractionPatternsResponse,
  ApiAnalyzeInteractionPatternsParam,
  ApiExportInteractionData,
  ApiExportInteractionDataResponse,
  ApiExportInteractionDataParam,
  ApiExportInteractionDataQuery,
} from './docs/interactions.docs';

@Controller('interactions')
@ApiTagsInteractions()
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('track')
  @ApiTrackInteraction()
  @ApiTrackInteractionResponse()
  async trackInteraction(
    @Body() trackData: TrackInteractionDto,
  ): Promise<void> {
    try {
      await this.interactionsService.trackInteraction(
        trackData.userId,
        trackData.contentId,
        trackData.interactionType,
        {
          interactionValue: trackData.interactionValue,
          moodAtInteraction: trackData.moodAtInteraction,
          moodIntensityAtInteraction: trackData.moodIntensityAtInteraction,
          interactionDurationSeconds: trackData.interactionDurationSeconds,
          context: trackData.context,
          notes: trackData.notes,
        },
      );
    } catch {
      throw new HttpException(
        'Failed to track interaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history/:userId')
  @ApiGetUserInteractionHistory()
  @ApiGetUserInteractionHistoryResponse()
  @ApiGetUserInteractionHistoryParam()
  @ApiGetUserInteractionHistoryQuery()
  async getUserInteractionHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: InteractionHistoryQueryDto,
  ): Promise<any[]> {
    try {
      return await this.interactionsService.getUserInteractionHistory(
        userId,
        query.limit,
      );
    } catch {
      throw new HttpException(
        'Failed to retrieve interaction history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('patterns/:userId')
  @ApiAnalyzeInteractionPatterns()
  @ApiAnalyzeInteractionPatternsResponse()
  @ApiAnalyzeInteractionPatternsParam()
  async analyzeInteractionPatterns(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any> {
    try {
      return await this.interactionsService.analyzeInteractionPatterns(userId);
    } catch {
      throw new HttpException(
        'Failed to analyze interaction patterns',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('export/:userId')
  @ApiExportInteractionData()
  @ApiExportInteractionDataResponse()
  @ApiExportInteractionDataParam()
  @ApiExportInteractionDataQuery()
  async exportInteractionData(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ExportQueryDto,
  ): Promise<any> {
    try {
      return await this.interactionsService.exportInteractionData(
        userId,
        query.format,
      );
    } catch {
      throw new HttpException(
        'Failed to export interaction data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
