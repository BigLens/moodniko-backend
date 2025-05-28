import { Test, TestingModule } from '@nestjs/testing';
import { ContentsService } from '../contents.service';
import { MoviesService } from '../providers/movies/movies.service';
import { SpotifyService } from '../providers/spotify/spotify.service';
import { BooksService } from '../providers/books/books.service';
import { ContentRepository } from '../repository/content.repository';
import { ContentType } from '../enum/content.enum';
import { ContentEntity } from '../model/content.entity';
import { SpotifyContentType } from '../providers/spotify/enum/spotify-content.enum';

describe('ContentsService', () => {
  let service: ContentsService;

  const mockContentEntity = (type: ContentType): ContentEntity => ({
    id: 1,
    externalId: 'test-id',
    title: 'Test Content',
    description: 'Test Description',
    imageUrl: 'http://test.com/image.jpg',
    type,
    moodtag: 'happy',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockMoviesService = {
    fetchMoviesByMood: jest.fn(),
  };

  const mockSpotifyService = {
    fetchContentByMood: jest.fn(),
  };

  const mockBooksService = {
    fetchBooksByMood: jest.fn(),
  };

  const mockContentRepository = {
    findByExternalId: jest.fn(),
    save: jest.fn(),
    saveMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentsService,
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: SpotifyService,
          useValue: mockSpotifyService,
        },
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: ContentRepository,
          useValue: mockContentRepository,
        },
      ],
    }).compile();

    service = module.get<ContentsService>(ContentsService);
    jest.clearAllMocks();
  });

  describe('getContentByMood', () => {
    it('should fetch and save movies successfully', async () => {
      const mockMovies = [mockContentEntity(ContentType.MOVIE)];
      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);
      mockContentRepository.findByExternalId.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockMovies[0]);

      const result = await service.getContentByMood('happy', ContentType.MOVIE);

      expect(mockMoviesService.fetchMoviesByMood).toHaveBeenCalledWith('happy');
      expect(mockContentRepository.findByExternalId).toHaveBeenCalledWith(
        'test-id',
        ContentType.MOVIE,
      );
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockMovies[0]);
      expect(result).toEqual(mockMovies);
    });

    it('should fetch and save music successfully', async () => {
      const mockMusic = [mockContentEntity(ContentType.MUSIC)];
      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockMusic);
      mockContentRepository.findByExternalId.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockMusic[0]);

      const result = await service.getContentByMood('happy', ContentType.MUSIC);

      expect(mockSpotifyService.fetchContentByMood).toHaveBeenCalledWith(
        'happy',
        SpotifyContentType.MUSIC,
      );
      expect(mockContentRepository.findByExternalId).toHaveBeenCalledWith(
        'test-id',
        ContentType.MUSIC,
      );
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockMusic[0]);
      expect(result).toEqual(mockMusic);
    });

    it('should fetch and save podcasts successfully', async () => {
      const mockPodcasts = [mockContentEntity(ContentType.PODCAST)];
      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockPodcasts);
      mockContentRepository.findByExternalId.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockPodcasts[0]);

      const result = await service.getContentByMood(
        'happy',
        ContentType.PODCAST,
      );

      expect(mockSpotifyService.fetchContentByMood).toHaveBeenCalledWith(
        'happy',
        SpotifyContentType.PODCAST,
      );
      expect(mockContentRepository.findByExternalId).toHaveBeenCalledWith(
        'test-id',
        ContentType.PODCAST,
      );
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockPodcasts[0]);
      expect(result).toEqual(mockPodcasts);
    });

    it('should fetch and save books successfully', async () => {
      const mockBooks = [mockContentEntity(ContentType.BOOK)];
      mockBooksService.fetchBooksByMood.mockResolvedValue(mockBooks);
      mockContentRepository.findByExternalId.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockBooks[0]);

      const result = await service.getContentByMood('happy', ContentType.BOOK);

      expect(mockBooksService.fetchBooksByMood).toHaveBeenCalledWith('happy');
      expect(mockContentRepository.findByExternalId).toHaveBeenCalledWith(
        'test-id',
        ContentType.BOOK,
      );
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockBooks[0]);
      expect(result).toEqual(mockBooks);
    });

    it('should handle existing content by returning it without saving', async () => {
      const mockMovies = [mockContentEntity(ContentType.MOVIE)];
      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);
      mockContentRepository.findByExternalId.mockResolvedValue(mockMovies[0]);

      const result = await service.getContentByMood('happy', ContentType.MOVIE);

      expect(mockContentRepository.findByExternalId).toHaveBeenCalledWith(
        'test-id',
        ContentType.MOVIE,
      );
      expect(mockContentRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(mockMovies);
    });

    it('should throw error for invalid content type', async () => {
      await expect(
        service.getContentByMood('happy', 'INVALID' as ContentType),
      ).rejects.toThrow('Invalid content type: INVALID');
    });

    it('should handle empty results from providers', async () => {
      mockMoviesService.fetchMoviesByMood.mockResolvedValue([]);

      const result = await service.getContentByMood('happy', ContentType.MOVIE);

      expect(result).toEqual([]);
      expect(mockContentRepository.findByExternalId).not.toHaveBeenCalled();
      expect(mockContentRepository.save).not.toHaveBeenCalled();
    });

    it('should handle provider errors gracefully', async () => {
      mockMoviesService.fetchMoviesByMood.mockRejectedValue(
        new Error('Provider error'),
      );

      await expect(
        service.getContentByMood('happy', ContentType.MOVIE),
      ).rejects.toThrow('Provider error');
    });

    it('should handle repository errors gracefully', async () => {
      const mockMovies = [mockContentEntity(ContentType.MOVIE)];
      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);
      mockContentRepository.findByExternalId.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(
        service.getContentByMood('happy', ContentType.MOVIE),
      ).rejects.toThrow('Repository error');
    });
  });
});
