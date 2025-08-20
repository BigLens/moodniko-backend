import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { InteractionType } from '@modules/contents/save_contents/entities/user-content-interaction.entity';

describe('InteractionsController', () => {
  let controller: InteractionsController;
  let mockInteractionsService: any;

  beforeEach(async () => {
    mockInteractionsService = {
      trackInteraction: jest.fn(),
      getUserInteractionHistory: jest.fn(),
      analyzeInteractionPatterns: jest.fn(),
      exportInteractionData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionsController],
      providers: [
        {
          provide: InteractionsService,
          useValue: mockInteractionsService,
        },
      ],
    }).compile();

    controller = module.get<InteractionsController>(InteractionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trackInteraction', () => {
    it('should track an interaction successfully', async () => {
      const trackData = {
        userId: 1,
        contentId: '123',
        interactionType: InteractionType.LIKE,
        moodAtInteraction: 'happy',
        moodIntensityAtInteraction: 8,
      };

      mockInteractionsService.trackInteraction.mockResolvedValue(undefined);

      await controller.trackInteraction(trackData);

      expect(mockInteractionsService.trackInteraction).toHaveBeenCalledWith(
        1,
        '123',
        InteractionType.LIKE,
        {
          moodAtInteraction: 'happy',
          moodIntensityAtInteraction: 8,
          interactionValue: undefined,
          interactionDurationSeconds: undefined,
          context: undefined,
          notes: undefined,
        },
      );
    });
  });

  describe('getUserInteractionHistory', () => {
    it('should return user interaction history', async () => {
      const mockHistory = [
        {
          id: 1,
          userId: 1,
          contentId: 1,
          interactionType: InteractionType.LIKE,
        },
      ];
      mockInteractionsService.getUserInteractionHistory.mockResolvedValue(
        mockHistory,
      );

      const result = await controller.getUserInteractionHistory(1, {
        limit: 10,
      });

      expect(result).toEqual(mockHistory);
      expect(
        mockInteractionsService.getUserInteractionHistory,
      ).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('analyzeInteractionPatterns', () => {
    it('should return interaction patterns analysis', async () => {
      const mockAnalysis = {
        totalInteractions: 5,
        patterns: { mostCommonType: InteractionType.LIKE },
        trends: { interactionFrequency: 'increasing' },
      };
      mockInteractionsService.analyzeInteractionPatterns.mockResolvedValue(
        mockAnalysis,
      );

      const result = await controller.analyzeInteractionPatterns(1);

      expect(result).toEqual(mockAnalysis);
      expect(
        mockInteractionsService.analyzeInteractionPatterns,
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('exportInteractionData', () => {
    it('should export interaction data', async () => {
      const mockExport = {
        userId: 1,
        format: 'json',
        data: [],
        exportedAt: new Date().toISOString(),
      };
      mockInteractionsService.exportInteractionData.mockResolvedValue(
        mockExport,
      );

      const result = await controller.exportInteractionData(1, {
        format: 'json',
      });

      expect(result).toEqual(mockExport);
      expect(
        mockInteractionsService.exportInteractionData,
      ).toHaveBeenCalledWith(1, 'json');
    });
  });
});
