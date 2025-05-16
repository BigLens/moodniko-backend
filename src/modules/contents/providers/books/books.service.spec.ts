import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { BooksService } from './books.service';
import { ContentType } from '@modules/contents/enum/content.enum';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

// Mocking the ContentEntity class
describe('BooksService', () => {
  let service: BooksService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockGoogleBook = {
    id: 'test-book-id',
    volumeInfo: {
      title: 'Test Book',
      authors: ['Test Author'],
      description: 'Test Description',
      imageLinks: {
        thumbnail: 'http://example.com/thumbnail.jpg',
        smallThumbnail: 'http://example.com/small-thumbnail.jpg',
      },
      language: 'en',
      categories: ['Fiction'],
      averageRating: 4.5,
      ratingsCount: 100,
      publishedDate: '2024-01-01',
      publisher: 'Test Publisher',
    },
  };

  const mockGoogleBooksResponse = {
    kind: 'books#volumes',
    totalItems: 1,
    items: [mockGoogleBook],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    process.env.GOOGLE_BOOKS_API_KEY = 'test-api-key';
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.GOOGLE_BOOKS_API_KEY;
  });

  describe('fetchBooksByMood', () => {
    it('should throw BadRequestException for empty mood', async () => {
      await expect(service.fetchBooksByMood('')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchBooksByMood('   ')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for missing API key', async () => {
      delete process.env.GOOGLE_BOOKS_API_KEY;
      await expect(service.fetchBooksByMood('happy')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return empty array for unknown mood', async () => {
      const result = await service.fetchBooksByMood('unknown_mood');
      expect(result).toEqual([]);
    });

    it('should successfully fetch books for valid mood', async () => {
      mockHttpService.get.mockReturnValue(
        of({ data: mockGoogleBooksResponse }),
      );

      const result = await service.fetchBooksByMood('happy');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: 'Test Book',
        type: ContentType.BOOK,
        moodtag: 'happy',
        description: 'Test Description',
        imageUrl: 'http://example.com/thumbnail.jpg',
      });
      expect(result[0].externalId).toBeDefined();
    });

    it('should filter out books without images', async () => {
      const bookWithoutImage = {
        ...mockGoogleBook,
        volumeInfo: {
          ...mockGoogleBook.volumeInfo,
          imageLinks: undefined,
        },
      };

      mockHttpService.get.mockReturnValue(
        of({ data: { ...mockGoogleBooksResponse, items: [bookWithoutImage] } }),
      );

      const result = await service.fetchBooksByMood('happy');
      expect(result).toHaveLength(0);
    });

    it('should use cache for repeated requests', async () => {
      mockHttpService.get.mockReturnValue(
        of({ data: mockGoogleBooksResponse }),
      );

      // First request
      await service.fetchBooksByMood('happy');
      // Second request should use cache
      await service.fetchBooksByMood('happy');

      // Should only make API call once
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => ({
          response: {
            status: 403,
            data: {
              error: {
                message: 'API not enabled',
              },
            },
          },
        })),
      );

      await expect(service.fetchBooksByMood('happy')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle rate limiting', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => ({
          response: {
            status: 429,
          },
        })),
      );

      await expect(service.fetchBooksByMood('happy')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle timeout errors', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => ({
          name: 'TimeoutError',
          message: 'Request timed out',
        })),
      );

      const result = await service.fetchBooksByMood('happy');
      expect(result).toEqual([]);
    });

    it('should include correct search parameters', async () => {
      mockHttpService.get.mockReturnValue(
        of({ data: mockGoogleBooksResponse }),
      );

      await service.fetchBooksByMood('happy');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            q: expect.any(String),
            key: 'test-api-key',
            maxResults: 20,
            langRestrict: 'en',
            printType: 'books',
            orderBy: 'relevance',
          }),
        }),
      );
    });
  });
});
