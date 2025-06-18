import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContentsService } from '../contents.service';
import { ContentEntity } from '../model/content.entity';
import { ContentType } from '../enum/content.enum';
import { MoviesService } from '../providers/movies/movies.service';
import { SpotifyService } from '../providers/spotify/spotify.service';
import { BooksService } from '../providers/books/books.service';

describe('ContentsService', () => {
  let service: ContentsService;
  const mockContentRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockMoviesService = {
    fetchMoviesByMood: jest.fn(),
  };

  const mockSpotifyService = {
    fetchContentByMood: jest.fn(),
  };

  const mockBooksService = {
    fetchBooksByMood: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentsService,
        {
          provide: getRepositoryToken(ContentEntity),
          useValue: mockContentRepository,
        },
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
      ],
    }).compile();

    service = module.get<ContentsService>(ContentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getContentByMood', () => {
    const mood = 'happy';

    it('should fetch and save movies', async () => {
      const mockMovies = [
        {
          id: 1,
          externalId: 'movie1',
          title: 'Test Movie',
          type: ContentType.MOVIE,
        } as ContentEntity,
      ];

      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);
      mockContentRepository.findOne.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockMovies[0]);

      const result = await service.getContentByMood(mood, ContentType.MOVIE);

      expect(result).toEqual(mockMovies);
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'movie1', type: ContentType.MOVIE },
      });
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockMovies[0]);
    });

    it('should fetch and save music', async () => {
      const mockMusic = [
        {
          id: 1,
          externalId: 'music1',
          title: 'Test Music',
          type: ContentType.MUSIC,
        } as ContentEntity,
      ];

      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockMusic);
      mockContentRepository.findOne.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockMusic[0]);

      const result = await service.getContentByMood(mood, ContentType.MUSIC);

      expect(result).toEqual(mockMusic);
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'music1', type: ContentType.MUSIC },
      });
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockMusic[0]);
    });

    it('should fetch and save podcasts', async () => {
      const mockPodcasts = [
        {
          id: 1,
          externalId: 'podcast1',
          title: 'Test Podcast',
          type: ContentType.PODCAST,
        } as ContentEntity,
      ];

      mockSpotifyService.fetchContentByMood.mockResolvedValue(mockPodcasts);
      mockContentRepository.findOne.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockPodcasts[0]);

      const result = await service.getContentByMood(mood, ContentType.PODCAST);

      expect(result).toEqual(mockPodcasts);
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'podcast1', type: ContentType.PODCAST },
      });
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockPodcasts[0]);
    });

    it('should fetch and save books', async () => {
      const mockBooks = [
        {
          id: 1,
          externalId: 'book1',
          title: 'Test Book',
          type: ContentType.BOOK,
        } as ContentEntity,
      ];

      mockBooksService.fetchBooksByMood.mockResolvedValue(mockBooks);
      mockContentRepository.findOne.mockResolvedValue(null);
      mockContentRepository.save.mockResolvedValue(mockBooks[0]);

      const result = await service.getContentByMood(mood, ContentType.BOOK);

      expect(result).toEqual(mockBooks);
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'book1', type: ContentType.BOOK },
      });
      expect(mockContentRepository.save).toHaveBeenCalledWith(mockBooks[0]);
    });

    it('should return existing content if already saved', async () => {
      const mockMovies = [
        {
          id: 1,
          externalId: 'movie1',
          title: 'Test Movie',
          type: ContentType.MOVIE,
        } as ContentEntity,
      ];

      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);
      mockContentRepository.findOne.mockResolvedValue(mockMovies[0]);

      const result = await service.getContentByMood(mood, ContentType.MOVIE);

      expect(result).toEqual(mockMovies);
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'movie1', type: ContentType.MOVIE },
      });
      expect(mockContentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid content type', async () => {
      await expect(
        service.getContentByMood(mood, 'INVALID' as ContentType),
      ).rejects.toThrow('Invalid content type: INVALID');

      expect(mockContentRepository.findOne).not.toHaveBeenCalled();
      expect(mockContentRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      const mockMovies = [
        {
          id: 1,
          externalId: 'movie1',
          title: 'Test Movie',
          type: ContentType.MOVIE,
        } as ContentEntity,
      ];

      mockMoviesService.fetchMoviesByMood.mockResolvedValue(mockMovies);
      mockContentRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.getContentByMood(mood, ContentType.MOVIE),
      ).rejects.toThrow('Database error');
    });
  });
});
