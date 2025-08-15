import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecommendationService } from './recommendation.service';
import { ContentRecommendation } from './interfaces/recommendation.interface';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import {
  RecommendationApiTags,
  GenerateRecommendationsDocs,
  GetQualityMetricsDocs,
  HealthCheckDocs,
  GenerateRecommendationsResponse,
  QualityMetricsResponse,
  HealthCheckResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  InternalServerErrorResponse,
} from './docs/recommendation.docs';

@UseGuards(JwtAuthGuard)
@Controller('recommendations')
@RecommendationApiTags()
@ApiBearerAuth('JWT-auth')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('generate')
  @GenerateRecommendationsDocs()
  @GenerateRecommendationsResponse()
  @BadRequestResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async generateRecommendations(
    @Request() req,
    @Body() request: RecommendationRequestDto,
  ): Promise<ContentRecommendation[]> {
    // Set userId from authenticated request
    const recommendationRequest = {
      ...request,
      userId: req.user.userId,
    };

    // Generate recommendations
    const recommendations =
      await this.recommendationService.generateRecommendations(
        recommendationRequest,
      );

    return recommendations;
  }

  @Get('quality-metrics')
  @GetQualityMetricsDocs()
  @QualityMetricsResponse()
  @UnauthorizedResponse()
  @InternalServerErrorResponse()
  async getQualityMetrics(@Request() req): Promise<any> {
    const metrics =
      await this.recommendationService.getRecommendationQualityMetrics(
        req.user.userId,
      );
    return metrics;
  }

  @Get('health')
  @HealthCheckDocs()
  @HealthCheckResponse()
  async healthCheck(): Promise<any> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'recommendation-engine',
    };
  }
}
