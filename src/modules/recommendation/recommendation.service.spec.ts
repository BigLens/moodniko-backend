import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';
import { UserPreferencesService } from '../user-preferences/user-preferences.service';
import { ContentsService } from '../contents/contents.service';

describe('RecommendationService', () => {
  let service: RecommendationService;
  let userPreferencesService: UserPreferencesService;
  let contentsService: ContentsService;

  const mockUserPreferencesService = {
    findByUserId: jest.fn(),
  };

  const mockContentsService = {
    // Add mock methods when content service is implemented
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        {
          provide: UserPreferencesService,
          useValue: mockUserPreferencesService,
        },
        {
          provide: ContentsService,
          useValue: mockContentsService,
        },
      ],
    }).compile();

    service = module.get<RecommendationService>(RecommendationService);
    userPreferencesService = module.get<UserPreferencesService>(UserPreferencesService);
    contentsService = module.get<ContentsService>(ContentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateRecommendations', () => {
    it('should return fallback recommendations when user preferences not found', async () => {
      const request = {
        userId: 1,
        currentMood: 'happy',
        moodIntensity: 7,
        limit: 5,
      };

      mockUserPreferencesService.findByUserId.mockResolvedValue(null);

      const result = await service.generateRecommendations(request);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].confidence).toBe(0.5);
      expect(result[0].reason).toBe('General recommendation based on mood');
    });

    it('should return personalized recommendations when user preferences exist', async () => {
      const request = {
        userId: 1,
        currentMood: 'happy',
        moodIntensity: 7,
        limit: 5,
      };

      const mockPreferences = {
        moodPreferences: {
          happy: {
            preferredContentTypes: ['music', 'movies'],
          },
        },
        moodIntensitySettings: {
          happy: {
            contentMappings: {
              music: { minIntensity: 1, maxIntensity: 10, priority: 1 },
              movies: { minIntensity: 1, maxIntensity: 10, priority: 2 },
            },
          },
        },
      };

      mockUserPreferencesService.findByUserId.mockResolvedValue(mockPreferences);

      const result = await service.generateRecommendations(request);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].confidence).toBeGreaterThan(0.5);
    });

    it('should handle errors gracefully and return fallback recommendations', async () => {
      const request = {
        userId: 1,
        currentMood: 'happy',
        moodIntensity: 7,
        limit: 5,
      };

      mockUserPreferencesService.findByUserId.mockRejectedValue(new Error('Database error'));

      const result = await service.generateRecommendations(request);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].confidence).toBe(0.5);
    });
  });

  describe('getRecommendationQualityMetrics', () => {
    it('should return placeholder metrics', async () => {
      const result = await service.getRecommendationQualityMetrics(1);

      expect(result).toEqual({
        totalRecommendations: 0,
        acceptedRecommendations: 0,
        rejectedRecommendations: 0,
        averageConfidence: 0,
        userSatisfaction: 0,
      });
    });
  });
});
