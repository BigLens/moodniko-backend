import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TrackInteractionDto,
  InteractionAnalysis,
  InteractionPattern,
} from './interfaces/interactions.interface';
import {
  UserContentInteractionEntity,
  InteractionType,
} from '@modules/contents/save_contents/entities/user-content-interaction.entity';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(UserContentInteractionEntity)
    private readonly interactionRepository: Repository<UserContentInteractionEntity>,
  ) {}

  /**
   * Track a user interaction with content
   */
  async trackInteraction(
    userId: number,
    contentId: string,
    interactionType: string,
    moodData?: Partial<TrackInteractionDto>,
  ): Promise<void> {
    const interaction = this.interactionRepository.create({
      userId,
      contentId: parseInt(contentId),
      interactionType: interactionType as InteractionType,
      interactionValue: moodData?.interactionValue,
      moodAtInteraction: moodData?.moodAtInteraction,
      moodIntensityAtInteraction: moodData?.moodIntensityAtInteraction,
      interactionDurationSeconds: moodData?.interactionDurationSeconds,
      context: moodData?.context,
      notes: moodData?.notes,
    });

    await this.interactionRepository.save(interaction);
  }

  /**
   * Get user's interaction history
   */
  async getUserInteractionHistory(
    userId: number,
    limit?: number,
  ): Promise<UserContentInteractionEntity[]> {
    const queryBuilder = this.interactionRepository
      .createQueryBuilder('interaction')
      .where('interaction.userId = :userId', { userId })
      .orderBy('interaction.createdAt', 'DESC');

    if (limit) {
      queryBuilder.limit(limit);
    }

    return queryBuilder.getMany();
  }

  /**
   * Analyze interaction patterns for a user
   */
  async analyzeInteractionPatterns(
    userId: number,
  ): Promise<InteractionAnalysis> {
    const interactions = await this.interactionRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    if (interactions.length === 0) {
      return {
        totalInteractions: 0,
        dateRange: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
        patterns: {
          mostCommonType: InteractionType.LIKE,
          averageDuration: 0,
          moodCorrelation: 0,
          timeOfDayPattern: 'unknown',
          contentTypePreference: 'unknown',
        },
        trends: {
          interactionFrequency: 'stable',
          moodCorrelation: 'neutral',
        },
      };
    }

    // Calculate patterns
    const typeCounts = interactions.reduce(
      (acc, interaction) => {
        acc[interaction.interactionType] =
          (acc[interaction.interactionType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostCommonType = Object.entries(typeCounts).reduce((a, b) =>
      typeCounts[a[0]] > typeCounts[b[0]] ? a : b,
    )[0] as InteractionType;

    const averageDuration =
      interactions.reduce(
        (sum, interaction) =>
          sum + (interaction.interactionDurationSeconds || 0),
        0,
      ) / interactions.length;

    // Mock patterns for now - these would be calculated based on actual data analysis
    const patterns: InteractionPattern = {
      mostCommonType,
      averageDuration: Math.round(averageDuration),
      moodCorrelation: 0.7, // TODO: Calculate actual correlation
      timeOfDayPattern: 'evening', // TODO: Analyze time patterns
      contentTypePreference: 'movies', // TODO: Analyze content preferences
    };

    return {
      totalInteractions: interactions.length,
      dateRange: {
        start: interactions[0].createdAt.toISOString(),
        end: interactions[interactions.length - 1].createdAt.toISOString(),
      },
      patterns,
      trends: {
        interactionFrequency: 'increasing', // TODO: Calculate actual trend
        moodCorrelation: 'positive', // TODO: Calculate actual correlation
      },
    };
  }

  /**
   * Export interaction data for a user
   */
  async exportInteractionData(userId: number, format: string): Promise<any> {
    const interactions = await this.getUserInteractionHistory(userId);

    const exportData = {
      userId,
      format,
      data: interactions,
      exportedAt: new Date().toISOString(),
    };

    if (format === 'csv') {
      // TODO: Convert to CSV format
      return exportData;
    }

    return exportData;
  }
}
