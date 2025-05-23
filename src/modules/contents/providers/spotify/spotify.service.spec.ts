import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { ContentType } from '@modules/contents/enum/content.enum';
import { SpotifyContentType } from './enum/spotify-content.enum';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

describe('SpotifyService', () => {
  let service: SpotifyService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockSpotifyTrack = {
    id: '123',
    name: 'Test Track',
    artists: [{ id: '1', name: 'Artist 1' }],
    album: {
      id: '1',
      name: 'Test Album',
      images: [{ url: 'http://test.com/image.jpg' }],
    },
    external_urls: { spotify: 'http://spotify.com/track/123' },
    preview_url: 'http://preview.com/track/123',
    popularity: 80,
    duration_ms: 180000,
    explicit: false,
  };

  const mockSpotifyPodcast = {
    id: '456',
    name: 'Test Podcast',
    publisher: 'Test Publisher',
    description: 'Test Description',
    images: [{ url: 'http://test.com/podcast.jpg' }],
    external_urls: { spotify: 'http://spotify.com/show/456' },
    total_episodes: 10,
    media_type: 'audio',
  };

  beforeEach(async () => {
    // Set up environment variables for all tests
    process.env.SPOTIFY_CLIENT_ID = 'test_client_id';
    process.env.SPOTIFY_CLIENT_SECRET = 'test_client_secret';

    // Mock successful token response for all tests
    mockHttpService.post.mockReturnValue(
      of({
        data: {
          access_token: 'test_token',
          expires_in: 3600,
        },
      }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
  });

  describe('getAccessToken', () => {
    it('should return cached token if valid', async () => {
      // First call to get token
      await service['getAccessToken']();
      // Second call should use cached token
      const token = await service['getAccessToken']();

      expect(token).toBe('test_token');
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);
    });

    it('should throw error if credentials not configured', async () => {
      delete process.env.SPOTIFY_CLIENT_ID;
      delete process.env.SPOTIFY_CLIENT_SECRET;

      await expect(service['getAccessToken']()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error if token request fails', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      await expect(service['getAccessToken']()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('searchContent', () => {
    it('should return music tracks successfully', async () => {
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            tracks: {
              items: [mockSpotifyTrack],
            },
          },
        }),
      );

      const tracks = await service['searchContent']('test query', 'track');
      expect(tracks).toHaveLength(1);
      expect(tracks[0]).toEqual(mockSpotifyTrack);
    });

    it('should return podcasts successfully', async () => {
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            shows: {
              items: [mockSpotifyPodcast],
            },
          },
        }),
      );

      const podcasts = await service['searchContent']('test query', 'show');
      expect(podcasts).toHaveLength(1);
      expect(podcasts[0]).toEqual(mockSpotifyPodcast);
    });

    it('should return empty array if no content found', async () => {
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            tracks: {
              items: [],
            },
            shows: {
              items: [],
            },
          },
        }),
      );

      const tracks = await service['searchContent']('test query', 'track');
      const podcasts = await service['searchContent']('test query', 'show');
      expect(tracks).toHaveLength(0);
      expect(podcasts).toHaveLength(0);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('API error')),
      );

      const tracks = await service['searchContent']('test query', 'track');
      const podcasts = await service['searchContent']('test query', 'show');
      expect(tracks).toHaveLength(0);
      expect(podcasts).toHaveLength(0);
    });
  });

  describe('fetchContentByMood', () => {
    it('should throw error if mood is empty', async () => {
      await expect(service.fetchContentByMood('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return empty array for unknown mood', async () => {
      const result = await service.fetchContentByMood('unknown_mood');
      expect(result).toHaveLength(0);
    });

    it('should return both music and podcasts when no content type specified', async () => {
      mockHttpService.get
        .mockReturnValueOnce(
          of({
            data: {
              tracks: {
                items: [mockSpotifyTrack],
              },
            },
          }),
        )
        .mockReturnValueOnce(
          of({
            data: {
              shows: {
                items: [mockSpotifyPodcast],
              },
            },
          }),
        );

      const result = await service.fetchContentByMood('happy');
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe(ContentType.MUSIC);
      expect(result[1].type).toBe(ContentType.PODCAST);
    });

    it('should return only music when SpotifyContentType.MUSIC specified', async () => {
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            tracks: {
              items: [mockSpotifyTrack],
            },
          },
        }),
      );

      const result = await service.fetchContentByMood(
        'happy',
        SpotifyContentType.MUSIC,
      );
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(ContentType.MUSIC);
    });

    it('should return only podcasts when SpotifyContentType.PODCAST specified', async () => {
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            shows: {
              items: [mockSpotifyPodcast],
            },
          },
        }),
      );

      const result = await service.fetchContentByMood(
        'happy',
        SpotifyContentType.PODCAST,
      );
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(ContentType.PODCAST);
    });

    it('should use cache for repeated requests', async () => {
      mockHttpService.get
        .mockReturnValueOnce(
          of({
            data: {
              tracks: {
                items: [mockSpotifyTrack],
              },
            },
          }),
        )
        .mockReturnValueOnce(
          of({
            data: {
              shows: {
                items: [mockSpotifyPodcast],
              },
            },
          }),
        );

      // First request
      await service.fetchContentByMood('happy');
      // Second request should use cache
      await service.fetchContentByMood('happy');

      // Should only make API calls once
      expect(mockHttpService.get).toHaveBeenCalledTimes(2);
    });

    it('should handle API errors gracefully', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('API error')),
      );

      const result = await service.fetchContentByMood('happy');
      expect(result).toHaveLength(0);
    });
  });
});
