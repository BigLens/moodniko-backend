import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InteractionsService } from './interactions.service';
import {
  UserContentInteractionEntity,
  InteractionType,
} from '@modules/contents/save_contents/entities/user-content-interaction.entity';

describe('InteractionsService', () => {
  let service: InteractionsService;
  let mockRepository: any;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionsService,
        {
          provide: getRepositoryToken(UserContentInteractionEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InteractionsService>(InteractionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackInteraction', () => {
    it('should track an interaction successfully', async () => {
      const mockInteraction = { id: 1, userId: 1, contentId: 1 };
      mockRepository.create.mockReturnValue(mockInteraction);
      mockRepository.save.mockResolvedValue(mockInteraction);

      await service.trackInteraction(1, '123', 'like', {
        moodAtInteraction: 'happy',
        moodIntensityAtInteraction: 8,
      });

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('getUserInteractionHistory', () => {
    it('should return user interaction history', async () => {
      const mockInteractions = [
        {
          id: 1,
          userId: 1,
          contentId: 1,
          interactionType: InteractionType.LIKE,
        },
      ];
      mockQueryBuilder.getMany.mockResolvedValue(mockInteractions);

      const result = await service.getUserInteractionHistory(1, 10);

      expect(result).toEqual(mockInteractions);
    });
  });

  describe('analyzeInteractionPatterns', () => {
    it('should return empty analysis when no interactions exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.analyzeInteractionPatterns(1);

      expect(result.totalInteractions).toBe(0);
      expect(result.patterns.mostCommonType).toBeDefined();
    });

    it('should analyze patterns when interactions exist', async () => {
      const mockInteractions = [
        {
          id: 1,
          userId: 1,
          contentId: 1,
          interactionType: InteractionType.LIKE,
          interactionDurationSeconds: 120,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 2,
          userId: 1,
          contentId: 2,
          interactionType: InteractionType.LIKE,
          interactionDurationSeconds: 180,
          createdAt: new Date('2024-01-02'),
        },
      ];
      mockRepository.find.mockResolvedValue(mockInteractions);

      const result = await service.analyzeInteractionPatterns(1);

      expect(result.totalInteractions).toBe(2);
      expect(result.patterns.mostCommonType).toBe(InteractionType.LIKE);
      expect(result.patterns.averageDuration).toBe(150);
    });
  });

  describe('exportInteractionData', () => {
    it('should export interaction data in JSON format', async () => {
      const mockInteractions = [
        {
          id: 1,
          userId: 1,
          contentId: 1,
          interactionType: InteractionType.LIKE,
        },
      ];
      mockQueryBuilder.getMany.mockResolvedValue(mockInteractions);

      const result = await service.exportInteractionData(1, 'json');

      expect(result.format).toBe('json');
      expect(result.data).toEqual(mockInteractions);
      expect(result.userId).toBe(1);
    });
  });
});
