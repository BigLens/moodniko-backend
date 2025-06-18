import { Test, TestingModule } from '@nestjs/testing';
import { SaveContentController } from '../save-content.controller';
import { SaveContentService } from '../save-content.service';
import { SavedContent } from '../save-content.entity';
import { BadRequestException } from '@nestjs/common';

describe('SaveContentController', () => {
  let controller: SaveContentController;
  let service: SaveContentService;

  const mockSaveContentService = {
    saveContent: jest.fn(),
    getSavedContents: jest.fn(),
    removeSavedContent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaveContentController],
      providers: [
        {
          provide: SaveContentService,
          useValue: mockSaveContentService,
        },
      ],
    }).compile();

    controller = module.get<SaveContentController>(SaveContentController);
    service = module.get<SaveContentService>(SaveContentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /contents/saved-contents', () => {
    const contentId = 1;
    const mood = 'happy';
    const mockSavedContent: SavedContent = {
      id: 1,
      contentId,
      mood,
      createdAt: new Date(),
      content: null,
    };

    it('should save content successfully', async () => {
      mockSaveContentService.saveContent.mockResolvedValue(mockSavedContent);

      const result = await controller.saveContent(contentId, mood);

      expect(result).toEqual(mockSavedContent);
      expect(service.saveContent).toHaveBeenCalledWith(contentId, mood);
    });

    it('should handle different mood types', async () => {
      const differentMoods = ['sad', 'anxious', 'energetic', 'excited'];

      for (const testMood of differentMoods) {
        const mockResult = { ...mockSavedContent, mood: testMood };
        mockSaveContentService.saveContent.mockResolvedValue(mockResult);

        const result = await controller.saveContent(contentId, testMood);

        expect(result.mood).toBe(testMood);
        expect(result.mood.length).toBeLessThanOrEqual(50);
      }
    });

    it('should handle mood length validation error', async () => {
      const longMood = 'a'.repeat(51);
      mockSaveContentService.saveContent.mockRejectedValue(
        new BadRequestException('Mood must be 50 characters or less'),
      );

      await expect(controller.saveContent(contentId, longMood)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.saveContent(contentId, longMood)).rejects.toThrow(
        'Mood must be 50 characters or less',
      );
    });

    it('should handle duplicate content with same mood error', async () => {
      mockSaveContentService.saveContent.mockRejectedValue(
        new BadRequestException('Content already saved with this mood'),
      );

      await expect(controller.saveContent(contentId, mood)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.saveContent(contentId, mood)).rejects.toThrow(
        'Content already saved with this mood',
      );
    });
  });

  describe('GET /contents/saved-contents', () => {
    const mockSavedContents: SavedContent[] = [
      {
        id: 1,
        contentId: 1,
        mood: 'happy',
        createdAt: new Date('2024-01-02'),
        content: null,
      },
      {
        id: 2,
        contentId: 2,
        mood: 'sad',
        createdAt: new Date('2024-01-01'),
        content: null,
      },
    ];

    it('should return all saved contents', async () => {
      mockSaveContentService.getSavedContents.mockResolvedValue(
        mockSavedContents,
      );

      const result = await controller.getSavedContents();

      expect(result).toEqual(mockSavedContents);
      expect(service.getSavedContents).toHaveBeenCalled();
    });

    it('should return empty array when no saved contents exist', async () => {
      mockSaveContentService.getSavedContents.mockResolvedValue([]);

      const result = await controller.getSavedContents();

      expect(result).toEqual([]);
      expect(service.getSavedContents).toHaveBeenCalled();
    });

    it('should return saved contents with proper structure', async () => {
      mockSaveContentService.getSavedContents.mockResolvedValue(
        mockSavedContents,
      );

      const result = await controller.getSavedContents();

      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('contentId');
        expect(item).toHaveProperty('mood');
        expect(item).toHaveProperty('createdAt');
        expect(item).toHaveProperty('content');
        expect(typeof item.mood).toBe('string');
        expect(item.mood.length).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('DELETE /contents/saved-contents/:contentId', () => {
    const contentId = 1;

    it('should remove saved content successfully', async () => {
      mockSaveContentService.removeSavedContent.mockResolvedValue(undefined);

      await controller.removeSavedContent(contentId);

      expect(service.removeSavedContent).toHaveBeenCalledWith(contentId);
    });

    it('should handle removal of non-existent content', async () => {
      mockSaveContentService.removeSavedContent.mockRejectedValue(
        new Error('Saved content not found'),
      );

      await expect(controller.removeSavedContent(999)).rejects.toThrow(
        'Saved content not found',
      );
    });
  });
});
