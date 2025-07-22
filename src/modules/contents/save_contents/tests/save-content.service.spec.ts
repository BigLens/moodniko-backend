import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SaveContentService } from '../save-content.service';
import { SavedContent } from '../save-content.entity';
import { ContentEntity } from '../../model/content.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSavedContentDto } from '../dto/create-saved-content.dto';
import { GetSavedContentsQueryDto } from '../dto/get-saved-contents-query.dto';
import { Mood } from '../enum/mood.enum';
import { ContentType } from '../../enum/content.enum';
import { Repository } from 'typeorm';

describe('SaveContentService', () => {
  let service: SaveContentService;
  let savedContentRepository: Repository<SavedContent>;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockSavedContentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
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
    savedContentRepository = module.get<Repository<SavedContent>>(
      getRepositoryToken(SavedContent),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveContent', () => {
    const createSavedContentDto: CreateSavedContentDto = {
      contentId: 1,
      mood: Mood.HAPPY,
    };

    it('should save content successfully', async () => {
      const mockContent = { id: createSavedContentDto.contentId };
      const mockSavedContent = {
        id: 1,
        ...createSavedContentDto,
        createdAt: new Date(),
        content: null,
      };

      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockSavedContentRepository.findOne.mockResolvedValue(null);
      mockSavedContentRepository.create.mockReturnValue(mockSavedContent);
      mockSavedContentRepository.save.mockResolvedValue(mockSavedContent);

      const result = await service.saveContent(createSavedContentDto, 1);

      expect(result).toEqual(mockSavedContent);
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { id: createSavedContentDto.contentId },
      });
      expect(mockSavedContentRepository.create).toHaveBeenCalledWith({
        ...createSavedContentDto,
        userId: 1,
      });
    });

    it('should throw BadRequestException when mood exceeds 50 characters', async () => {
      const longMoodDto = {
        ...createSavedContentDto,
        mood: 'a'.repeat(51) as Mood,
      };
      await expect(service.saveContent(longMoodDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when content does not exist', async () => {
      mockContentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.saveContent(createSavedContentDto, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when content is already saved with same mood', async () => {
      const mockContent = { id: createSavedContentDto.contentId };
      const mockExistingSave = { id: 1, ...createSavedContentDto };

      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockSavedContentRepository.findOne.mockResolvedValue(mockExistingSave);

      await expect(
        service.saveContent(createSavedContentDto, 1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSavedContents', () => {
    it('should return paginated and filtered contents', async () => {
      const query: GetSavedContentsQueryDto = {
        page: 2,
        limit: 5,
        mood: Mood.SAD,
        contentType: ContentType.MOVIE,
      };
      const skip = (query.page - 1) * query.limit;
      const mockResult = [{ id: 1 }];

      mockQueryBuilder.getMany.mockResolvedValue(mockResult);

      const result = await service.getSavedContents(query, 1);

      expect(result).toEqual(mockResult);
      expect(savedContentRepository.createQueryBuilder).toHaveBeenCalledWith(
        'savedContent',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(skip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(query.limit);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'savedContent.mood = :mood',
        { mood: query.mood },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'content.type = :contentType',
        { contentType: query.contentType },
      );
    });

    it('should use default pagination values', async () => {
      const query: GetSavedContentsQueryDto = {};
      const defaultPage = 1;
      const defaultLimit = 10;
      const skip = (defaultPage - 1) * defaultLimit;

      await service.getSavedContents(query, 1);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(skip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(defaultLimit);
    });
  });

  describe('removeSavedContent', () => {
    const contentId = 1;

    it('should remove saved content successfully', async () => {
      mockSavedContentRepository.count.mockResolvedValue(1);

      await service.removeSavedContent(contentId, 1);

      expect(mockSavedContentRepository.count).toHaveBeenCalledWith({
        where: { contentId, userId: 1 },
      });
      expect(mockSavedContentRepository.delete).toHaveBeenCalledWith({
        contentId,
        userId: 1,
      });
    });

    it('should throw NotFoundException when saved content does not exist', async () => {
      mockSavedContentRepository.count.mockResolvedValue(0);

      await expect(service.removeSavedContent(contentId, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
