import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { MoviesService } from './movies.service';
import { ContentType } from '@modules/contents/enum/content.enum';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockTmdbResponse = {
    results: [
      {
        id: 1,
        title: 'Test Movie',
        overview: 'Test Overview',
        poster_path: '/test.jpg',
        vote_average: 7.5,
        release_date: '2024-01-01',
      },
    ],
  };

  const createMockResponse = (data: any): AxiosResponse => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: {} as any,
      url: '',
      method: 'get',
    } as InternalAxiosRequestConfig,
  });

  const createMockError = (status: number, message: string): AxiosError => ({
    name: 'AxiosError',
    message,
    response: {
      status,
      data: { message },
      statusText: message,
      headers: {},
      config: {
        headers: {} as any,
        url: '',
        method: 'get',
      } as InternalAxiosRequestConfig,
    },
    config: {
      headers: {} as any,
      url: '',
      method: 'get',
    } as InternalAxiosRequestConfig,
    isAxiosError: true,
    toJSON: () => ({}),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    process.env.TMDB_API_KEY = 'test-api-key';
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.TMDB_API_KEY;
  });

  describe('fetchMoviesByMood', () => {
    it('should throw BadRequestException for empty mood', async () => {
      await expect(service.fetchMoviesByMood('')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.fetchMoviesByMood('   ')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for missing API key', async () => {
      delete process.env.TMDB_API_KEY;
      await expect(service.fetchMoviesByMood('happy')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return empty array for non-existent mood', async () => {
      const result = await service.fetchMoviesByMood('nonexistent');
      expect(result).toEqual([]);
    });

    it('should successfully fetch movies for valid mood', async () => {
      mockHttpService.get.mockReturnValue(
        of(createMockResponse(mockTmdbResponse)),
      );
      const result = await service.fetchMoviesByMood('happy');
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: 'Test Movie',
        type: ContentType.MOVIE,
        moodtag: 'happy',
        description: 'Test Overview',
        imageUrl: 'https://image.tmdb.org/t/p/w500/test.jpg',
        externalId: '1',
      });
    });

    it('should use cache for repeated requests', async () => {
      mockHttpService.get.mockReturnValue(
        of(createMockResponse(mockTmdbResponse)),
      );
      await service.fetchMoviesByMood('happy');
      await service.fetchMoviesByMood('happy');
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should handle API timeout', async () => {
      const timeoutError = new Error('Timeout has occurred');
      timeoutError.name = 'TimeoutError';
      mockHttpService.get.mockReturnValue(throwError(() => timeoutError));
      const result = await service.fetchMoviesByMood('happy');
      expect(result).toEqual([]);
    });

    it('should handle 401 Unauthorized error', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => createMockError(401, 'Unauthorized')),
      );
      await expect(service.fetchMoviesByMood('happy')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle 429 Rate Limit error', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => createMockError(429, 'Too Many Requests')),
      );
      await expect(service.fetchMoviesByMood('happy')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should retry failed requests', async () => {
      mockHttpService.get
        .mockReturnValueOnce(
          throwError(() => createMockError(500, 'Network error')),
        )
        .mockReturnValueOnce(of(createMockResponse(mockTmdbResponse)));

      const result = await service.fetchMoviesByMood('happy');
      expect(result).toHaveLength(1);
      expect(mockHttpService.get).toHaveBeenCalledTimes(2);
    });
  });
});
