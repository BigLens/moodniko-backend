import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';
import { MoodHistoryService } from '../mood/mood-history/mood-history.service';

describe('RecommendationService', () => {
  let service: RecommendationService;
  let moodHistoryService: MoodHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        {
          provide: MoodHistoryService,
          useValue: {
            analyzeMoodHistory: jest.fn().mockResolvedValue({
              patterns: [],
              trends: [],
              recommendations: [],
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RecommendationService>(RecommendationService);
    moodHistoryService = module.get<MoodHistoryService>(MoodHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateRecommendations', () => {
    it('should return recommendations with mood history analysis', async () => {
      const request = {
        userId: 1,
        currentMood: 'happy',
        moodIntensity: 7,
        limit: 5,
      };

      const mockMoodAnalysis = {
        totalEntries: 20,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-30'),
        },
        patterns: [
          {
            mood: 'happy',
            frequency: 5,
            averageIntensity: 6,
            commonTriggers: ['good news'],
            timeOfDay: 'Morning (6AM-12PM)',
            dayOfWeek: 'Monday',
            averageDuration: 90,
          },
        ],
        trends: [
          {
            period: 'Period 1',
            averageMood: 'happy',
            moodStability: 0.7,
            intensityTrend: 'stable' as const,
            topMoods: [{ mood: 'happy', count: 5 }],
          },
        ],
        recommendations: ['Keep up the positive mood'],
      };

      jest
        .spyOn(moodHistoryService, 'analyzeMoodHistory')
        .mockResolvedValue(mockMoodAnalysis);

      const result = await service.generateRecommendations(request);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(moodHistoryService.analyzeMoodHistory).toHaveBeenCalledWith(
        request.userId,
        30,
      );
    });

    it('should handle errors gracefully and return fallback recommendations', async () => {
      const request = {
        userId: 1,
        currentMood: 'happy',
        moodIntensity: 7,
        limit: 5,
      };

      jest
        .spyOn(moodHistoryService, 'analyzeMoodHistory')
        .mockRejectedValue(new Error('Database error'));

      const result = await service.generateRecommendations(request);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getRecommendationQualityMetrics', () => {
    it('should return metrics with mood history data', async () => {
      const mockMoodAnalysis = {
        totalEntries: 20,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-30'),
        },
        patterns: [
          {
            mood: 'happy',
            frequency: 5,
            averageIntensity: 6,
            commonTriggers: ['good news'],
            timeOfDay: 'Morning (6AM-12PM)',
            dayOfWeek: 'Monday',
            averageDuration: 90,
          },
        ],
        trends: [
          {
            period: 'Period 1',
            averageMood: 'happy',
            moodStability: 0.7,
            intensityTrend: 'stable' as const,
            topMoods: [{ mood: 'happy', count: 5 }],
          },
        ],
        recommendations: ['Keep up the positive mood'],
      };

      jest
        .spyOn(moodHistoryService, 'analyzeMoodHistory')
        .mockResolvedValue(mockMoodAnalysis);

      const result = await service.getRecommendationQualityMetrics(1);

      expect(result).toBeDefined();
      expect(result.totalMoodEntries).toBe(20);
      expect(result.patternsIdentified).toBe(1);
      expect(result.trendsAnalyzed).toBe(1);
    });
  });
});
