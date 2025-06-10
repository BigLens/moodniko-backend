import { Test, TestingModule } from '@nestjs/testing';
import { SaveContentController } from '../save-content.controller';
import { SaveContentService } from '../save-content.service';
import { SavedContent } from '../save-content.entity';

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
  });

  describe('GET /contents/saved-contents', () => {
    const mockSavedContents: SavedContent[] = [
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

    it('should return all saved contents', async () => {
      mockSaveContentService.getSavedContents.mockResolvedValue(
        mockSavedContents,
      );

      const result = await controller.getSavedContents();

      expect(result).toEqual(mockSavedContents);
      expect(service.getSavedContents).toHaveBeenCalled();
    });
  });

  describe('DELETE /contents/saved-contents/:contentId', () => {
    const contentId = 1;

    it('should remove saved content successfully', async () => {
      mockSaveContentService.removeSavedContent.mockResolvedValue(undefined);

      await controller.removeSavedContent(contentId);

      expect(service.removeSavedContent).toHaveBeenCalledWith(contentId);
    });
  });
});
