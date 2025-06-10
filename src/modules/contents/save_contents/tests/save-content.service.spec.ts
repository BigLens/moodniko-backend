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
    remove: jest.fn(),
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

    it('should throw NotFoundException when content does not exist', async () => {
      mockContentRepository.findOne.mockResolvedValue(null);

      await expect(service.saveContent(contentId, mood)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when content is already saved', async () => {
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
    });
  });

  describe('getSavedContents', () => {
    it('should return all saved contents', async () => {
      const mockSavedContents = [
        {
          id: 1,
          contentId: 1,
          mood: 'happy',
          createdAt: new Date(),
          content: null,
        },
        {
          id: 2,
          contentId: 2,
          mood: 'sad',
          createdAt: new Date(),
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
  });

  describe('removeSavedContent', () => {
    const contentId = 1;

    it('should remove saved content successfully', async () => {
      const mockSavedContent = {
        id: 1,
        contentId,
        mood: 'happy',
        createdAt: new Date(),
        content: null,
      };

      mockSavedContentRepository.findOne.mockResolvedValue(mockSavedContent);

      await service.removeSavedContent(contentId);

      expect(mockSavedContentRepository.findOne).toHaveBeenCalledWith({
        where: { contentId },
      });
      expect(mockSavedContentRepository.remove).toHaveBeenCalledWith(
        mockSavedContent,
      );
    });

    it('should throw NotFoundException when saved content does not exist', async () => {
      mockSavedContentRepository.findOne.mockResolvedValue(null);

      await expect(service.removeSavedContent(contentId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
