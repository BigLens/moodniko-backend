import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SaveContentService } from '../save-content.service';
import { SavedContent } from '../save-content.entity';
import { ContentEntity } from '../../model/content.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SaveContentService', () => {
  let service: SaveContentService;

  const mockSavedContentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  const mockContentRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveContentService,
        {
          provide: getRepositoryToken(SavedContent),
          useValue: mockSavedContentRepository,
        },
        {
          provide: getRepositoryToken(ContentEntity),
          useValue: mockContentRepository,
        },
      ],
    }).compile();

    service = module.get<SaveContentService>(SaveContentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveContent', () => {
    const contentId = 1;
    const mood = 'happy';

    it('should save content successfully', async () => {
      const mockContent = { id: contentId };
      const mockSavedContent = {
        id: 1,
        contentId,
        mood,
        createdAt: new Date(),
        content: null,
      };

      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockSavedContentRepository.findOne.mockResolvedValue(null);
      mockSavedContentRepository.create.mockReturnValue(mockSavedContent);
      mockSavedContentRepository.save.mockResolvedValue(mockSavedContent);

      const result = await service.saveContent(contentId, mood);

      expect(result).toEqual(mockSavedContent);
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { id: contentId },
      });
      expect(mockSavedContentRepository.create).toHaveBeenCalledWith({
        contentId,
        mood,
      });
    });

    it('should save content with mood within length limit', async () => {
      const mockContent = { id: contentId };
      const shortMood = 'sad';
      const mockSavedContent = {
        id: 1,
        contentId,
        mood: shortMood,
        createdAt: new Date(),
        content: null,
      };

      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockSavedContentRepository.findOne.mockResolvedValue(null);
      mockSavedContentRepository.create.mockReturnValue(mockSavedContent);
      mockSavedContentRepository.save.mockResolvedValue(mockSavedContent);

      const result = await service.saveContent(contentId, shortMood);

      expect(result.mood).toBe(shortMood);
      expect(result.mood.length).toBeLessThanOrEqual(50);
    });

    it('should throw BadRequestException when mood exceeds 50 characters', async () => {
      const longMood = 'a'.repeat(51);

      await expect(service.saveContent(contentId, longMood)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.saveContent(contentId, longMood)).rejects.toThrow(
        'Mood must be 50 characters or less',
      );
    });

    it('should throw NotFoundException when content does not exist', async () => {
      mockContentRepository.findOne.mockResolvedValue(null);

      await expect(service.saveContent(contentId, mood)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when content is already saved with same mood', async () => {
      const mockContent = { id: contentId };
      const mockExistingSave = {
        id: 1,
        contentId,
        mood,
        createdAt: new Date(),
        content: null,
      };

      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockSavedContentRepository.findOne.mockResolvedValue(mockExistingSave);

      await expect(service.saveContent(contentId, mood)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.saveContent(contentId, mood)).rejects.toThrow(
        'Content already saved with this mood',
      );
    });

    it('should allow saving same content with different moods', async () => {
      const mockContent = { id: contentId };
      const mood1 = 'happy';
      const mood2 = 'sad';
      const mockSavedContent = {
        id: 1,
        contentId,
        mood: mood2,
        createdAt: new Date(),
        content: null,
      };

      mockContentRepository.findOne.mockResolvedValue(mockContent);
      // First mood doesn't exist
      mockSavedContentRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockSavedContentRepository.create.mockReturnValue(mockSavedContent);
      mockSavedContentRepository.save.mockResolvedValue(mockSavedContent);

      // Should be able to save with different moods
      await service.saveContent(contentId, mood1);
      await service.saveContent(contentId, mood2);

      expect(mockSavedContentRepository.findOne).toHaveBeenCalledWith({
        where: { contentId, mood: mood1 },
      });
      expect(mockSavedContentRepository.findOne).toHaveBeenCalledWith({
        where: { contentId, mood: mood2 },
      });
    });
  });

  describe('getSavedContents', () => {
    it('should return all saved contents ordered by createdAt DESC', async () => {
      const mockSavedContents = [
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

      mockSavedContentRepository.find.mockResolvedValue(mockSavedContents);

      const result = await service.getSavedContents();

      expect(result).toEqual(mockSavedContents);
      expect(mockSavedContentRepository.find).toHaveBeenCalledWith({
        relations: ['content'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle empty saved contents list', async () => {
      mockSavedContentRepository.find.mockResolvedValue([]);

      const result = await service.getSavedContents();

      expect(result).toEqual([]);
      expect(mockSavedContentRepository.find).toHaveBeenCalledWith({
        relations: ['content'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('removeSavedContent', () => {
    const contentId = 1;

    it('should remove saved content successfully', async () => {
      mockSavedContentRepository.count.mockResolvedValue(1);

      await service.removeSavedContent(contentId);

      expect(mockSavedContentRepository.count).toHaveBeenCalledWith({
        where: { contentId },
      });
      expect(mockSavedContentRepository.delete).toHaveBeenCalledWith({
        contentId,
      });
    });

    it('should throw NotFoundException when saved content does not exist', async () => {
      mockSavedContentRepository.count.mockResolvedValue(0);

      await expect(service.removeSavedContent(contentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.removeSavedContent(contentId)).rejects.toThrow(
        'Saved content not found',
      );
    });
  });
});
