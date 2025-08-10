import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  HttpStatus,
  HttpException,
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
} from './docs/recommendation.docs';

@UseGuards(JwtAuthGuard)
@Controller('recommendations')
@RecommendationApiTags()
@ApiBearerAuth('JWT-auth')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('generate')
  @GenerateRecommendationsDocs()
  async generateRecommendations(
    @Request() req,
    @Body() request: RecommendationRequestDto,
  ): Promise<ContentRecommendation[]> {
    try {
      // Validate request
      if (!request.currentMood) {
        throw new HttpException(
          'Current mood is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Set userId from authenticated request
      const recommendationRequest = {
        ...request,
        userId: req.user.userId,
      };

      // Generate recommendations
      const recommendations = await this.recommendationService.generateRecommendations(
        recommendationRequest,
      );

      return recommendations;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('Error in generateRecommendations:', error);
      throw new HttpException(
        'Failed to generate recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('quality-metrics')
  @GetQualityMetricsDocs()
  async getQualityMetrics(@Request() req): Promise<any> {
    try {
      const metrics = await this.recommendationService.getRecommendationQualityMetrics(
        req.user.userId,
      );
      return metrics;
    } catch (error) {
      console.error('Error in getQualityMetrics:', error);
      throw new HttpException(
        'Failed to retrieve quality metrics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @HealthCheckDocs()
  async healthCheck(): Promise<any> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'recommendation-engine',
    };
  }
}
