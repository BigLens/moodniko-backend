import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MoodHistoryService } from './mood-history.service';
import { Response } from 'express';
import {
  MoodHistoryApiTags,
  GetMoodAnalysisDocs,
  GetMoodPatternsDocs,
  GetMoodTrendsDocs,
  GetMoodFrequencyDocs,
  GetMoodTriggersDocs,
  GetContentInteractionAnalysisDocs,
  GetContentRecommendationsByMoodDocs,
  ExportMoodHistoryDocs,
  HealthCheckDocs,
  MoodAnalysisResponse,
  MoodPatternsResponse,
  ContentInteractionAnalysisResponse,
  ContentRecommendationsResponse,
  ExportResponse,
  HealthCheckResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  InternalServerErrorResponse,
} from './docs/mood-history.docs';
import { MoodAnalysisQueryDto } from './dto/mood-analysis-query.dto';
import { MoodPatternsQueryDto } from './dto/mood-patterns-query.dto';
import { ContentRecommendationsQueryDto } from './dto/content-recommendations-query.dto';
import { ExportQueryDto } from './dto/export-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('mood-history')
@MoodHistoryApiTags()
@ApiBearerAuth('JWT-auth')
export class MoodHistoryController {
  constructor(private readonly moodHistoryService: MoodHistoryService) {}

  @Get('analysis')
  @GetMoodAnalysisDocs()
  @MoodAnalysisResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getMoodAnalysis(@Request() req, @Query() query: MoodAnalysisQueryDto) {
    const analysis = await this.moodHistoryService.analyzeMoodHistory(
      req.user.userId,
      query.days,
    );

    return analysis;
  }

  @Get('patterns')
  @GetMoodPatternsDocs()
  @MoodPatternsResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getMoodPatterns(@Request() req, @Query() query: MoodPatternsQueryDto) {
    const patterns = await this.moodHistoryService.getMoodPatterns(
      req.user.userId,
      query.period,
    );

    return patterns;
  }

  @Get('trends')
  @GetMoodTrendsDocs()
  @MoodPatternsResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getMoodTrends(@Request() req, @Query() query: MoodAnalysisQueryDto) {
    const trends = await this.moodHistoryService.getMoodTrends(
      req.user.userId,
      query.days,
    );

    return trends;
  }

  @Get('frequency')
  @GetMoodFrequencyDocs()
  @MoodPatternsResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getMoodFrequency(@Request() req, @Query() query: MoodAnalysisQueryDto) {
    const frequency = await this.moodHistoryService.getMoodFrequency(
      req.user.userId,
      query.days,
    );

    return frequency;
  }

  @Get('triggers')
  @GetMoodTriggersDocs()
  @MoodPatternsResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getMoodTriggers(@Request() req, @Query() query: MoodAnalysisQueryDto) {
    const triggers = await this.moodHistoryService.getMoodTriggers(
      req.user.userId,
      query.days,
    );

    return triggers;
  }

  @Get('content-interactions')
  @GetContentInteractionAnalysisDocs()
  @ContentInteractionAnalysisResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getContentInteractionAnalysis(
    @Request() req,
    @Query() query: MoodAnalysisQueryDto,
  ) {
    const analysis =
      await this.moodHistoryService.getContentInteractionAnalysis(
        req.user.userId,
        query.days,
      );

    return analysis;
  }

  @Get('content-recommendations')
  @GetContentRecommendationsByMoodDocs()
  @ContentRecommendationsResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getContentRecommendationsByMood(
    @Request() req,
    @Query() query: ContentRecommendationsQueryDto,
  ) {
    const recommendations =
      await this.moodHistoryService.getContentRecommendationsByMood(
        req.user.userId,
        query.currentMood,
        query.days,
      );

    return recommendations;
  }

  @Get('export')
  @ExportMoodHistoryDocs()
  @ExportResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async exportMoodHistory(
    @Request() req,
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ) {
    const exportData = await this.moodHistoryService.exportMoodHistory(
      req.user.userId,
      query.format,
      query.days,
    );

    if (query.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="mood-history-${new Date().toISOString().split('T')[0]}.csv"`,
      );
      return res.send(exportData);
    }

    return exportData;
  }

  @Get('health')
  @HealthCheckDocs()
  @HealthCheckResponse()
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'mood-history-service',
    };
  }
}
