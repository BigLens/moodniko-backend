import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';

describe('RecommendationController', () => {
  let controller: RecommendationController;
  let recommendationService: RecommendationService;

  const mockRecommendationService = {
    generateRecommendations: jest.fn(),
    getRecommendationQualityMetrics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationController],
      providers: [
        {
          provide: RecommendationService,
          useValue: mockRecommendationService,
        },
      ],
    }).compile();

    controller = module.get<RecommendationController>(RecommendationController);
    recommendationService = module.get<RecommendationService>(RecommendationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations successfully', async () => {
      const mockRequest: RecommendationRequestDto = {
        currentMood: 'happy',
        moodIntensity: 7,
        limit: 5,
      };

      const mockRecommendations = [
        {
          id: '1',
          title: 'Happy Music',
          type: 'music',
          mood: 'happy',
          intensity: 7,
          confidence: 0.8,
          reason: 'Matches your mood preferences',
        },
      ];

      mockRecommendationService.generateRecommendations.mockResolvedValue(mockRecommendations);

      const mockReq = {
        user: { userId: 1 },
      };

      const result = await controller.generateRecommendations(mockReq, mockRequest);

      expect(result).toEqual(mockRecommendations);
      expect(recommendationService.generateRecommendations).toHaveBeenCalledWith({
        ...mockRequest,
        userId: 1,
      });
    });

    it('should throw error when currentMood is missing', async () => {
      const mockRequest = {
        moodIntensity: 7,
        limit: 5,
      } as RecommendationRequestDto; // Type assertion for testing invalid data

      const mockReq = {
        user: { userId: 1 },
      };

      await expect(
        controller.generateRecommendations(mockReq, mockRequest),
      ).rejects.toThrow('Current mood is required');
    });
  });

  describe('getQualityMetrics', () => {
    it('should return quality metrics', async () => {
      const mockMetrics = {
        totalRecommendations: 10,
        acceptedRecommendations: 8,
        rejectedRecommendations: 2,
        averageConfidence: 0.75,
        userSatisfaction: 0.8,
      };

      mockRecommendationService.getRecommendationQualityMetrics.mockResolvedValue(mockMetrics);

      const mockReq = {
        user: { userId: 1 },
      };

      const result = await controller.getQualityMetrics(mockReq);

      expect(result).toEqual(mockMetrics);
      expect(recommendationService.getRecommendationQualityMetrics).toHaveBeenCalledWith(1);
    });
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const result = await controller.healthCheck();

      expect(result).toEqual({
        status: 'healthy',
        timestamp: expect.any(String),
        service: 'recommendation-engine',
      });
    });
  });
});
