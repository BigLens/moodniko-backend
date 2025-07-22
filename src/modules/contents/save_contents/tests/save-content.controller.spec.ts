import { Test, TestingModule } from '@nestjs/testing';
import { SaveContentController } from '../save-content.controller';
import { SaveContentService } from '../save-content.service';
import { SavedContent } from '../save-content.entity';
import { CreateSavedContentDto } from '../dto/create-saved-content.dto';
import { GetSavedContentsQueryDto } from '../dto/get-saved-contents-query.dto';
import { Mood } from '../enum/mood.enum';

describe('SaveContentController', () => {
  let controller: SaveContentController;
  let service: SaveContentService;

  const mockSaveContentService = {
    saveContent: jest.fn(),
    getSavedContents: jest.fn(),
    removeSavedContent: jest.fn(),
    getSavedContentById: jest.fn(),
    removeSavedContentById: jest.fn(),
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
    const createSavedContentDto: CreateSavedContentDto = {
      contentId: 1,
      mood: Mood.HAPPY,
    };
    const mockSavedContent: SavedContent = {
      id: 1,
      contentId: 1,
      mood: 'happy',
      createdAt: new Date(),
      content: null,
      userId: 1,
      user: {
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
        moods: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    it('should call the saveContent service method', async () => {
      mockSaveContentService.saveContent.mockResolvedValue(mockSavedContent);

      const req = { user: { userId: 1 } };
      const result = await controller.saveContent(createSavedContentDto, req);

      expect(result).toEqual(mockSavedContent);
      expect(service.saveContent).toHaveBeenCalledWith(
        createSavedContentDto,
        1,
      );
    });
  });

  describe('GET /contents/saved-contents', () => {
    it('should call the getSavedContents service method', async () => {
      const query: GetSavedContentsQueryDto = { page: 1, limit: 10 };
      const mockResult: SavedContent[] = [];
      mockSaveContentService.getSavedContents.mockResolvedValue(mockResult);

      const req = { user: { userId: 1 } };
      const result = await controller.getSavedContents(query, req);

      expect(result).toEqual(mockResult);
      expect(service.getSavedContents).toHaveBeenCalledWith(query, 1);
    });
  });

  describe('DELETE /contents/saved-contents/:contentId', () => {
    it('should call the removeSavedContent service method', async () => {
      const contentId = 1;
      mockSaveContentService.removeSavedContent.mockResolvedValue({
        message: 'Resource deleted',
      });

      const req = { user: { userId: 1 } };
      await controller.removeSavedContent(contentId, req);

      expect(service.removeSavedContent).toHaveBeenCalledWith(contentId, 1);
    });
  });
});
