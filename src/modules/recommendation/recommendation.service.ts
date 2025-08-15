import { Injectable } from '@nestjs/common';
import { MoodHistoryService } from '../mood/mood-history/mood-history.service';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import {
  ContentRecommendation,
  MoodContentMapping,
} from './interfaces/recommendation.interface';

@Injectable()
export class RecommendationService {
  constructor(private readonly moodHistoryService: MoodHistoryService) {}

  /**
   * Generate personalized content recommendations based on user mood and preferences
   */
  async generateRecommendations(
    request: RecommendationRequestDto & { userId: number },
  ): Promise<ContentRecommendation[]> {
    try {
      // Get user preferences for mood-based recommendations
      // const userPreferences = await this.userPreferencesService.findByUserId(
      //   request.userId,
      // );

      // if (!userPreferences) {
      //   return this.getFallbackRecommendations(request);
      // }

      // Get mood history analysis for better recommendations
      const moodAnalysis = await this.moodHistoryService.analyzeMoodHistory(
        request.userId,
        30, // Analyze last 30 days
      );

      // Analyze user preferences and generate recommendations with historical context
      const recommendations = await this.analyzeUserPreferencesAndRecommend(
        request,
        // userPreferences,
        moodAnalysis,
      );

      // If no personalized recommendations, fall back to general ones
      if (recommendations.length === 0) {
        return this.getFallbackRecommendations(request);
      }

      return recommendations.slice(0, request.limit || 10);
    } catch (error) {
      // Log error and return fallback recommendations
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(request);
    }
  }

  /**
   * Analyze user preferences and generate personalized recommendations with historical context
   */
  private async analyzeUserPreferencesAndRecommend(
    request: RecommendationRequestDto & { userId: number },
    // userPreferences: any,
    moodAnalysis: any,
  ): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];

    // Get mood-specific preferences
    // const moodPreferences =
    //   userPreferences.moodPreferences?.[request.currentMood];
    // const intensitySettings =
    //   userPreferences.moodIntensitySettings?.[request.currentMood];

    // if (!moodPreferences && !intensitySettings) {
    //   return recommendations;
    // }

    // Apply rule-based recommendation logic with historical context
    const contentTypes = this.getPreferredContentTypes(
      request,
      // moodPreferences,
      moodAnalysis,
    );

    for (const contentType of contentTypes) {
      const contentItems = await this.getContentByType(
        contentType,
        request.limit || 5,
      );

      for (const content of contentItems) {
        const recommendation = this.createRecommendation(
          content,
          request.currentMood,
          request.moodIntensity || 5,
          // moodPreferences,
          // intensitySettings,
          moodAnalysis,
        );

        if (recommendation.confidence > 0.3) {
          recommendations.push(recommendation);
        }
      }
    }

    // Sort by confidence and return
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get preferred content types based on user preferences, request, and historical analysis
   */
  private getPreferredContentTypes(
    request: RecommendationRequestDto & { userId: number },
    // moodPreferences: any,
    moodAnalysis: any,
  ): string[] {
    if (request.contentTypes && request.contentTypes.length > 0) {
      return request.contentTypes;
    }

    // if (moodPreferences?.preferredContentTypes) {
    //   return moodPreferences.preferredContentTypes;
    // }

    // Use historical mood patterns to suggest content types
    if (moodAnalysis?.patterns?.length > 0) {
      const currentMoodPattern = moodAnalysis.patterns.find(
        (p: any) => p.mood === request.currentMood,
      );

      if (currentMoodPattern) {
        // If user frequently experiences this mood, suggest content types based on patterns
        return this.getContentTypesForMoodPattern(currentMoodPattern);
      }
    }

    // Default content types for the mood
    return this.getDefaultContentTypesForMood(request.currentMood);
  }

  /**
   * Get content types based on mood pattern analysis
   */
  private getContentTypesForMoodPattern(moodPattern: any): string[] {
    const { mood, frequency, averageIntensity } = moodPattern;

    // High frequency moods get more diverse content types
    if (frequency > 10) {
      return ['music', 'movies', 'books', 'podcasts'];
    }

    // High intensity moods might need calming content
    if (averageIntensity > 7) {
      if (mood === 'stressed' || mood === 'anxious') {
        return ['music', 'books', 'meditation'];
      }
      if (mood === 'energetic') {
        return ['music', 'movies', 'workouts'];
      }
    }

    // Default based on mood
    return this.getDefaultContentTypesForMood(mood);
  }

  /**
   * Get default content types for specific moods
   */
  private getDefaultContentTypesForMood(mood: string): string[] {
    const moodContentMapping: MoodContentMapping = {
      happy: {
        preferredContentTypes: ['music', 'movies', 'books'],
        intensityThresholds: {
          music: { minIntensity: 1, maxIntensity: 10, priority: 1 },
          movies: { minIntensity: 1, maxIntensity: 10, priority: 2 },
          books: { minIntensity: 1, maxIntensity: 10, priority: 3 },
        },
      },
      sad: {
        preferredContentTypes: ['music', 'books', 'movies'],
        intensityThresholds: {
          music: { minIntensity: 1, maxIntensity: 8, priority: 1 },
          books: { minIntensity: 1, maxIntensity: 7, priority: 2 },
          movies: { minIntensity: 1, maxIntensity: 6, priority: 3 },
        },
      },
      energetic: {
        preferredContentTypes: ['music', 'movies', 'books'],
        intensityThresholds: {
          music: { minIntensity: 6, maxIntensity: 10, priority: 1 },
          movies: { minIntensity: 5, maxIntensity: 10, priority: 2 },
          books: { minIntensity: 4, maxIntensity: 9, priority: 3 },
        },
      },
      calm: {
        preferredContentTypes: ['books', 'music', 'movies'],
        intensityThresholds: {
          books: { minIntensity: 1, maxIntensity: 5, priority: 1 },
          music: { minIntensity: 1, maxIntensity: 6, priority: 2 },
          movies: { minIntensity: 1, maxIntensity: 5, priority: 3 },
        },
      },
      stressed: {
        preferredContentTypes: ['music', 'books', 'movies'],
        intensityThresholds: {
          music: { minIntensity: 1, maxIntensity: 4, priority: 1 },
          books: { minIntensity: 1, maxIntensity: 5, priority: 2 },
          movies: { minIntensity: 1, maxIntensity: 4, priority: 3 },
        },
      },
    };

    return (
      moodContentMapping[mood]?.preferredContentTypes || [
        'music',
        'movies',
        'books',
      ]
    );
  }

  /**
   * Get content by type (placeholder - will be implemented when content service is available)
   */
  private async getContentByType(
    contentType: string,
    limit: number,
  ): Promise<any[]> {
    // TODO: Implement when content service methods are available
    // For now, return mock data
    const mockData = [
      {
        id: `mock-${contentType}-1`,
        title: `Sample ${contentType} 1`,
        type: contentType,
        mood: 'neutral',
        intensity: 5,
      },
      {
        id: `mock-${contentType}-2`,
        title: `Sample ${contentType} 2`,
        type: contentType,
        mood: 'neutral',
        intensity: 5,
      },
    ];

    return mockData.slice(0, limit);
  }

  /**
   * Create a recommendation with confidence scoring and historical context
   */
  private createRecommendation(
    content: any,
    currentMood: string,
    moodIntensity: number,
    // moodPreferences: any,
    // intensitySettings: any,
    moodAnalysis: any,
  ): ContentRecommendation {
    let confidence = 0.5; // Base confidence
    let reason = 'General recommendation';

    // Boost confidence based on mood preferences
    // if (moodPreferences?.preferredContentTypes?.includes(content.type)) {
    //   confidence += 0.2;
    //   reason = 'Matches your mood preferences';
    // }

    // Boost confidence based on intensity settings
    // if (intensitySettings?.contentMappings?.[content.type]) {
    //   const mapping = intensitySettings.contentMappings[content.type];
    //   if (
    //     moodIntensity >= mapping.minIntensity &&
    //     moodIntensity <= mapping.maxIntensity
    //   ) {
    //     confidence += 0.3;
    //     reason = 'Perfect intensity match for your current mood';
    //   }
    // }

    // Boost confidence for high-priority content types
    // if (intensitySettings?.contentMappings?.[content.type]?.priority === 1) {
    //   confidence += 0.1;
    //   reason += ' - High priority content type';
    // }

    // Boost confidence based on historical mood patterns
    if (moodAnalysis?.patterns?.length > 0) {
      const moodPattern = moodAnalysis.patterns.find(
        (p: any) => p.mood === currentMood,
      );

      if (moodPattern) {
        // If this mood is frequent, boost confidence
        if (moodPattern.frequency > 5) {
          confidence += 0.1;
          reason += ' - Based on your frequent mood patterns';
        }

        // If content type matches common triggers, boost confidence
        if (
          moodPattern.commonTriggers.some(
            (trigger: string) =>
              content.title.toLowerCase().includes(trigger.toLowerCase()) ||
              content.description
                ?.toLowerCase()
                .includes(trigger.toLowerCase()),
          )
        ) {
          confidence += 0.15;
          reason += ' - Matches your mood triggers';
        }
      }
    }

    // Boost confidence based on mood trends
    if (moodAnalysis?.trends?.length > 0) {
      const recentTrend = moodAnalysis.trends[moodAnalysis.trends.length - 1];

      // If mood stability is high, boost confidence
      if (recentTrend.moodStability > 0.7) {
        confidence += 0.05;
        reason += ' - High mood stability pattern';
      }
    }

    return {
      id: content.id,
      title: content.title,
      type: content.type,
      mood: currentMood,
      intensity: moodIntensity,
      confidence: Math.min(confidence, 1.0),
      reason,
    };
  }

  /**
   * Get fallback recommendations for new users or when personalization fails
   */
  private async getFallbackRecommendations(
    request: RecommendationRequestDto & { userId: number },
  ): Promise<ContentRecommendation[]> {
    const defaultContentTypes = this.getDefaultContentTypesForMood(
      request.currentMood,
    );
    const recommendations: ContentRecommendation[] = [];

    for (const contentType of defaultContentTypes.slice(0, 3)) {
      const contentItems = await this.getContentByType(contentType, 2);

      for (const content of contentItems) {
        recommendations.push({
          id: content.id,
          title: content.title,
          type: content.type,
          mood: request.currentMood,
          intensity: request.moodIntensity || 5,
          confidence: 0.5,
          reason: 'General recommendation based on mood',
        });
      }
    }

    return recommendations.slice(0, request.limit || 6);
  }

  /**
   * Get recommendation quality metrics with historical data
   */
  async getRecommendationQualityMetrics(userId: number): Promise<any> {
    try {
      // Get mood analysis for quality insights
      const moodAnalysis = await this.moodHistoryService.analyzeMoodHistory(
        userId,
        30,
      );

      // Calculate metrics based on historical data
      const totalMoods = moodAnalysis.totalEntries;
      const moodStability =
        moodAnalysis.trends.length > 0
          ? moodAnalysis.trends[moodAnalysis.trends.length - 1].moodStability
          : 0;

      // Estimate recommendation quality based on mood patterns
      const averageConfidence = moodStability > 0.7 ? 0.8 : 0.6;
      const userSatisfaction = moodStability > 0.5 ? 0.75 : 0.6;

      return {
        totalRecommendations: totalMoods * 3, // Estimate 3 recommendations per mood entry
        acceptedRecommendations: Math.round(totalMoods * 3 * userSatisfaction),
        rejectedRecommendations: Math.round(
          totalMoods * 3 * (1 - userSatisfaction),
        ),
        averageConfidence,
        userSatisfaction,
        moodStability,
        totalMoodEntries: totalMoods,
        patternsIdentified: moodAnalysis.patterns.length,
        trendsAnalyzed: moodAnalysis.trends.length,
      };
    } catch (error) {
      console.error('Error getting recommendation quality metrics:', error);
      return {
        totalRecommendations: 0,
        acceptedRecommendations: 0,
        rejectedRecommendations: 0,
        averageConfidence: 0,
        userSatisfaction: 0,
        moodStability: 0,
        totalMoodEntries: 0,
        patternsIdentified: 0,
        trendsAnalyzed: 0,
      };
    }
  }
}
