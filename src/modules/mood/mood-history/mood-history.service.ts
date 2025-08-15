import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { MoodEntity } from '../entity/mood.entity';
import { UserContentInteractionEntity } from '../../contents/save_contents/entities/user-content-interaction.entity';
import {
  MoodPattern,
  MoodTrend,
  MoodAnalysis,
} from './interfaces/mood-history.interface';

@Injectable()
export class MoodHistoryService {
  constructor(
    @InjectRepository(MoodEntity)
    private readonly moodRepository: Repository<MoodEntity>,
    @InjectRepository(UserContentInteractionEntity)
    private readonly interactionRepository: Repository<UserContentInteractionEntity>,
  ) {}

  /**
   * Get comprehensive mood history analysis for a user
   */
  async analyzeMoodHistory(
    userId: number,
    days: number = 30,
  ): Promise<MoodAnalysis> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.moodRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, new Date()),
      },
      order: { createdAt: 'ASC' },
    });

    if (moods.length === 0) {
      return this.getEmptyAnalysis(startDate, new Date());
    }

    const patterns = await this.analyzeMoodPatterns(moods);
    const trends = await this.analyzeMoodTrends(moods, days);
    const recommendations = this.generateRecommendations(patterns, trends);

    return {
      totalEntries: moods.length,
      dateRange: { start: startDate, end: new Date() },
      patterns,
      trends,
      recommendations,
    };
  }

  /**
   * Get mood patterns for specific time periods
   */
  async getMoodPatterns(
    userId: number,
    period: 'day' | 'week' | 'month' | 'year' = 'month',
  ): Promise<MoodPattern[]> {
    const startDate = this.getStartDateForPeriod(period);

    const moods = await this.moodRepository.find({
      where: {
        user: { id: userId },
        createdAt: MoreThanOrEqual(startDate),
      },
    });

    return this.analyzeMoodPatterns(moods);
  }

  /**
   * Get mood trends over time
   */
  async getMoodTrends(userId: number, days: number = 30): Promise<MoodTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.moodRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, new Date()),
      },
      order: { createdAt: 'ASC' },
    });

    return this.analyzeMoodTrends(moods, days);
  }

  /**
   * Get mood frequency analysis
   */
  async getMoodFrequency(
    userId: number,
    days: number = 30,
  ): Promise<Array<{ mood: string; count: number; percentage: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.moodRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, new Date()),
      },
    });

    const moodCounts = moods.reduce(
      (acc, mood) => {
        acc[mood.feeling] = (acc[mood.feeling] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = moods.length;
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }

  /**
   * Get mood triggers analysis
   */
  async getMoodTriggers(
    userId: number,
    days: number = 30,
  ): Promise<
    Array<{ trigger: string; frequency: number; associatedMoods: string[] }>
  > {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.moodRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, new Date()),
      },
    });

    // Filter moods with triggers after fetching
    const moodsWithTriggers = moods.filter(
      (mood) => mood.triggers && mood.triggers.length > 0,
    );

    const triggerAnalysis = new Map<
      string,
      { frequency: number; moods: Set<string> }
    >();

    moodsWithTriggers.forEach((mood) => {
      if (mood.triggers) {
        mood.triggers.forEach((trigger) => {
          if (!triggerAnalysis.has(trigger)) {
            triggerAnalysis.set(trigger, { frequency: 0, moods: new Set() });
          }
          const analysis = triggerAnalysis.get(trigger)!;
          analysis.frequency++;
          analysis.moods.add(mood.feeling);
        });
      }
    });

    return Array.from(triggerAnalysis.entries()).map(([trigger, data]) => ({
      trigger,
      frequency: data.frequency,
      associatedMoods: Array.from(data.moods),
    }));
  }

  /**
   * Get content interaction analysis correlated with moods
   */
  async getContentInteractionAnalysis(
    userId: number,
    days: number = 30,
  ): Promise<{
    totalInteractions: number;
    interactionsByMood: Array<{
      mood: string;
      count: number;
      percentage: number;
    }>;
    interactionsByType: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    moodContentCorrelation: Array<{
      mood: string;
      preferredContentTypes: string[];
      averageRating: number;
    }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const interactions = await this.interactionRepository.find({
      where: {
        userId,
        createdAt: Between(startDate, new Date()),
      },
      relations: ['content'],
    });

    if (interactions.length === 0) {
      return {
        totalInteractions: 0,
        interactionsByMood: [],
        interactionsByType: [],
        moodContentCorrelation: [],
      };
    }

    // Analyze interactions by mood
    const moodCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();
    const moodContentMap = new Map<
      string,
      { contentTypes: Set<string>; ratings: number[] }
    >();

    interactions.forEach((interaction) => {
      // Count by mood
      const mood = interaction.moodAtInteraction || 'unknown';
      moodCounts.set(mood, (moodCounts.get(mood) || 0) + 1);

      // Count by interaction type
      const type = interaction.interactionType;
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);

      // Correlate mood with content types and ratings
      if (!moodContentMap.has(mood)) {
        moodContentMap.set(mood, { contentTypes: new Set(), ratings: [] });
      }
      const moodData = moodContentMap.get(mood)!;
      moodData.contentTypes.add(interaction.content.type);

      if (interaction.interactionValue) {
        moodData.ratings.push(interaction.interactionValue);
      }
    });

    // Convert to arrays for response
    const interactionsByMood = Array.from(moodCounts.entries()).map(
      ([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / interactions.length) * 100),
      }),
    );

    const interactionsByType = Array.from(typeCounts.entries()).map(
      ([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / interactions.length) * 100),
      }),
    );

    const moodContentCorrelation = Array.from(moodContentMap.entries()).map(
      ([mood, data]) => ({
        mood,
        preferredContentTypes: Array.from(data.contentTypes),
        averageRating:
          data.ratings.length > 0
            ? Math.round(
                (data.ratings.reduce((a, b) => a + b, 0) /
                  data.ratings.length) *
                  10,
              ) / 10
            : 0,
      }),
    );

    return {
      totalInteractions: interactions.length,
      interactionsByMood,
      interactionsByType,
      moodContentCorrelation,
    };
  }

  /**
   * Get content recommendations based on mood and interaction history
   */
  async getContentRecommendationsByMood(
    userId: number,
    currentMood: string,
    days: number = 30,
  ): Promise<{
    recommendedContentTypes: string[];
    moodBasedPreferences: Array<{
      contentType: string;
      confidence: number;
      reason: string;
    }>;
    interactionInsights: string[];
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get mood patterns
    const moodPatterns = await this.getMoodPatterns(userId, 'month');
    const currentMoodPattern = moodPatterns.find((p) => p.mood === currentMood);

    // Get content interaction analysis
    const interactionAnalysis = await this.getContentInteractionAnalysis(
      userId,
      days,
    );

    // Get mood-specific content preferences
    const moodContentPrefs = interactionAnalysis.moodContentCorrelation.find(
      (c) => c.mood === currentMood,
    );

    const recommendedContentTypes: string[] = [];
    const moodBasedPreferences: Array<{
      contentType: string;
      confidence: number;
      reason: string;
    }> = [];
    const interactionInsights: string[] = [];

    // Base recommendations from mood patterns
    if (currentMoodPattern) {
      if (currentMoodPattern.frequency > 5) {
        recommendedContentTypes.push('music', 'movies', 'books');
        interactionInsights.push(
          `You experience ${currentMood} moods frequently (${currentMoodPattern.frequency} times)`,
        );
      }

      if (currentMoodPattern.averageIntensity > 7) {
        recommendedContentTypes.push('meditation', 'calming_music');
        interactionInsights.push(
          `Your ${currentMood} moods are high intensity - consider calming content`,
        );
      }
    }

    // Content type preferences based on interaction history
    if (moodContentPrefs) {
      moodContentPrefs.preferredContentTypes.forEach((contentType) => {
        const confidence = moodContentPrefs.averageRating > 7 ? 0.9 : 0.7;
        moodBasedPreferences.push({
          contentType,
          confidence,
          reason: `Based on your ${currentMood} mood interactions (avg rating: ${moodContentPrefs.averageRating})`,
        });
      });
    }

    // Remove duplicates and return
    const uniqueContentTypes = [...new Set(recommendedContentTypes)];

    return {
      recommendedContentTypes: uniqueContentTypes,
      moodBasedPreferences,
      interactionInsights,
    };
  }

  /**
   * Export mood history data for a user
   */
  async exportMoodHistory(
    userId: number,
    format: 'json' | 'csv' = 'json',
    days: number = 365,
  ): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.moodRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, new Date()),
      },
      order: { createdAt: 'ASC' },
    });

    if (format === 'csv') {
      return this.convertToCSV(moods);
    }

    return {
      userId,
      exportDate: new Date().toISOString(),
      dateRange: { start: startDate, end: new Date() },
      totalEntries: moods.length,
      data: moods.map((mood) => ({
        id: mood.id,
        feeling: mood.feeling,
        intensity: mood.intensity,
        context: mood.context,
        triggers: mood.triggers,
        notes: mood.notes,
        location: mood.location,
        weather: mood.weather,
        activity: mood.activity,
        socialContext: mood.socialContext,
        energyLevel: mood.energyLevel,
        stressLevel: mood.stressLevel,
        sleepQuality: mood.sleepQuality,
        moodDurationMinutes: mood.moodDurationMinutes,
        moodChangeReason: mood.moodChangeReason,
        createdAt: mood.createdAt,
        updatedAt: mood.updatedAt,
      })),
    };
  }

  /**
   * Private helper methods
   */
  private async analyzeMoodPatterns(
    moods: MoodEntity[],
  ): Promise<MoodPattern[]> {
    const patterns = new Map<string, MoodPattern>();

    moods.forEach((mood) => {
      if (!patterns.has(mood.feeling)) {
        patterns.set(mood.feeling, {
          mood: mood.feeling,
          frequency: 0,
          averageIntensity: 0,
          commonTriggers: [],
          timeOfDay: this.getTimeOfDay(mood.createdAt),
          dayOfWeek: this.getDayOfWeek(mood.createdAt),
          averageDuration: 0,
        });
      }

      const pattern = patterns.get(mood.feeling)!;
      pattern.frequency++;
      pattern.averageIntensity += mood.intensity || 5;

      if (mood.triggers) {
        pattern.commonTriggers.push(...mood.triggers);
      }

      if (mood.moodDurationMinutes) {
        pattern.averageDuration += mood.moodDurationMinutes;
      }
    });

    // Calculate averages
    patterns.forEach((pattern) => {
      pattern.averageIntensity = Math.round(
        pattern.averageIntensity / pattern.frequency,
      );
      pattern.averageDuration = Math.round(
        pattern.averageDuration / pattern.frequency,
      );

      // Get most common triggers
      const triggerCounts = pattern.commonTriggers.reduce(
        (acc, trigger) => {
          acc[trigger] = (acc[trigger] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      pattern.commonTriggers = Object.entries(triggerCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([trigger]) => trigger);
    });

    return Array.from(patterns.values());
  }

  private async analyzeMoodTrends(
    moods: MoodEntity[],
    days: number,
  ): Promise<MoodTrend[]> {
    const trends: MoodTrend[] = [];
    const periods = this.divideIntoPeriods(days);

    periods.forEach((period) => {
      const periodMoods = moods.filter(
        (mood) =>
          mood.createdAt >= period.start && mood.createdAt <= period.end,
      );

      if (periodMoods.length === 0) return;

      const moodCounts = periodMoods.reduce(
        (acc, mood) => {
          acc[mood.feeling] = (acc[mood.feeling] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const topMoods = Object.entries(moodCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([mood, count]) => ({ mood, count }));

      trends.push({
        period: period.name,
        averageMood: topMoods[0]?.mood || 'neutral',
        moodStability: this.calculateMoodStability(periodMoods),
        intensityTrend: this.determineIntensityTrend(periodMoods),
        topMoods,
      });
    });

    return trends;
  }

  private generateRecommendations(
    patterns: MoodPattern[],
    trends: MoodTrend[],
  ): string[] {
    const recommendations: string[] = [];

    // Analyze patterns for recommendations
    patterns.forEach((pattern) => {
      if (pattern.frequency > 5) {
        if (pattern.averageIntensity > 7) {
          recommendations.push(
            `High intensity ${pattern.mood} moods are frequent. Consider stress management techniques.`,
          );
        }
        if (pattern.commonTriggers.length > 0) {
          recommendations.push(
            `Common triggers for ${pattern.mood} moods: ${pattern.commonTriggers.join(', ')}. Consider avoiding or managing these triggers.`,
          );
        }
      }
    });

    // Analyze trends for recommendations
    trends.forEach((trend) => {
      if (trend.moodStability < 0.3) {
        recommendations.push(
          'Mood stability is low. Consider establishing daily routines and stress management practices.',
        );
      }
      if (trend.intensityTrend === 'increasing') {
        recommendations.push(
          'Mood intensity is increasing. Consider mindfulness and relaxation techniques.',
        );
      }
    });

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  private getStartDateForPeriod(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return weekStart;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  private divideIntoPeriods(
    days: number,
  ): Array<{ name: string; start: Date; end: Date }> {
    const periods = [];
    const periodSize = Math.ceil(days / 7); // Divide into 7 periods

    for (let i = 0; i < 7; i++) {
      const start = new Date();
      start.setDate(start.getDate() - (days - i * periodSize));

      const end = new Date();
      end.setDate(end.getDate() - (days - (i + 1) * periodSize));

      periods.push({
        name: `Period ${i + 1}`,
        start,
        end,
      });
    }

    return periods;
  }

  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 6) return 'Early Morning (12AM-6AM)';
    if (hour < 12) return 'Morning (6AM-12PM)';
    if (hour < 18) return 'Afternoon (12PM-6PM)';
    return 'Evening (6PM-12AM)';
  }

  private getDayOfWeek(date: Date): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[date.getDay()];
  }

  private calculateMoodStability(moods: MoodEntity[]): number {
    if (moods.length < 2) return 1;

    const moodChanges = moods
      .slice(1)
      .filter((mood, index) => mood.feeling !== moods[index].feeling).length;

    return 1 - moodChanges / (moods.length - 1);
  }

  private determineIntensityTrend(
    moods: MoodEntity[],
  ): 'increasing' | 'decreasing' | 'stable' {
    if (moods.length < 3) return 'stable';

    const intensities = moods.map((m) => m.intensity || 5);
    const firstHalf = intensities.slice(0, Math.floor(intensities.length / 2));
    const secondHalf = intensities.slice(Math.floor(intensities.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    if (Math.abs(difference) < 0.5) return 'stable';
    return difference > 0 ? 'increasing' : 'decreasing';
  }

  private getEmptyAnalysis(startDate: Date, endDate: Date): MoodAnalysis {
    return {
      totalEntries: 0,
      dateRange: { start: startDate, end: endDate },
      patterns: [],
      trends: [],
      recommendations: [
        'Start tracking your moods to get personalized insights and recommendations.',
      ],
    };
  }

  private convertToCSV(moods: MoodEntity[]): string {
    const headers = [
      'ID',
      'Feeling',
      'Intensity',
      'Context',
      'Triggers',
      'Notes',
      'Location',
      'Weather',
      'Activity',
      'Social Context',
      'Energy Level',
      'Stress Level',
      'Sleep Quality',
      'Mood Duration (minutes)',
      'Mood Change Reason',
      'Created At',
    ];

    const rows = moods.map((mood) => [
      mood.id,
      mood.feeling,
      mood.intensity || '',
      mood.context || '',
      (mood.triggers || []).join(';'),
      mood.notes || '',
      mood.location || '',
      mood.weather || '',
      mood.activity || '',
      mood.socialContext || '',
      mood.energyLevel || '',
      mood.stressLevel || '',
      mood.sleepQuality || '',
      mood.moodDurationMinutes || '',
      mood.moodChangeReason || '',
      mood.createdAt.toISOString(),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
  }
}
