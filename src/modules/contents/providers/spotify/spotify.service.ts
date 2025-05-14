import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { mapToContentEntity } from './spotify.mapper';
import {
  SpotifyTrack,
  SpotifyPodcast,
  SpotifyAuthResponse,
  SpotifySearchResponse,
} from './interface/spotify.interface';
import { moodToGenreMap } from './mood-mapping';

@Injectable()
export class SpotifyService {
  private readonly SPOTIFY_API_URL = 'https://api.spotify.com/v1';
  private readonly AUTH_URL = 'https://accounts.spotify.com/api/token';
  private readonly SEARCH_URL = `${this.SPOTIFY_API_URL}/search`;
  private readonly RECOMMENDATIONS_URL = `${this.SPOTIFY_API_URL}/recommendations`;

  private readonly cache = new Map<
    string,
    { data: ContentEntity[]; timestamp: number }
  >();
  private readonly CACHE_TTL = 3600000;
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 1000;
  private readonly REQUEST_TIMEOUT = 8000;
  private readonly RATE_LIMIT_DELAY = 1000;

  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private lastRequestTime: number = 0;

  constructor(private readonly http: HttpService) {}

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await this.delay(this.RATE_LIMIT_DELAY - timeSinceLastRequest);
    }

    this.lastRequestTime = Date.now();
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry > Date.now() + 60000) {
      return this.accessToken;
    }

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new InternalServerErrorException(
        'Spotify credentials not configured',
      );
    }

    await this.enforceRateLimit();

    const credentials = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64');

    try {
      const { data } = await firstValueFrom(
        this.http
          .post<SpotifyAuthResponse>(
            this.AUTH_URL,
            'grant_type=client_credentials',
            {
              headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .pipe(timeout(this.REQUEST_TIMEOUT)),
      );

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error.message);
      throw new InternalServerErrorException(
        'Failed to get Spotify access token',
      );
    }
  }

  private async searchMusic(
    query: string,
    limit: number = 20,
  ): Promise<SpotifyTrack[]> {
    await this.enforceRateLimit();
    const accessToken = await this.getAccessToken();
    const params = {
      q: query,
      type: 'track',
      limit,
    };

    try {
      const { data } = await firstValueFrom(
        this.http
          .get<SpotifySearchResponse>(this.SEARCH_URL, {
            params,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .pipe(timeout(this.REQUEST_TIMEOUT)),
      );

      return data.tracks?.items || [];
    } catch (error) {
      console.error('Error searching music:', error.message);
      return [];
    }
  }

  private async searchPodcasts(
    query: string,
    limit: number = 20,
  ): Promise<SpotifyPodcast[]> {
    await this.enforceRateLimit();
    const accessToken = await this.getAccessToken();
    const params = {
      q: query,
      type: 'show',
      limit,
    };

    try {
      const { data } = await firstValueFrom(
        this.http
          .get<SpotifySearchResponse>(this.SEARCH_URL, {
            params,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .pipe(timeout(this.REQUEST_TIMEOUT)),
      );

      return data.shows?.items || [];
    } catch (error) {
      console.error('Error searching podcasts:', error.message);
      return [];
    }
  }

  async fetchContentByMood(
    mood: string,
    contentType?: ContentType,
  ): Promise<ContentEntity[]> {
    if (!mood?.trim()) {
      throw new BadRequestException('Mood parameter is required');
    }

    const normalizedMood = mood.toLowerCase().trim();
    const cacheKey = `spotify:mood:${normalizedMood}:${contentType || 'all'}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const moodConfig = moodToGenreMap[normalizedMood];
    if (!moodConfig) {
      console.log(`No mapping found for mood: ${mood}`);
      return [];
    }

    try {
      const { genres } = moodConfig;
      const content: ContentEntity[] = [];

      // Fetch music if requested or if no specific content type is specified
      if (!contentType || contentType === ContentType.MUSIC) {
        const musicQuery = genres
          .map((genre) => `${genre} ${normalizedMood}`)
          .join(' OR ');
        const tracks = await this.searchMusic(musicQuery);
        content.push(
          ...tracks.map((track) =>
            mapToContentEntity(track, ContentType.MUSIC, normalizedMood),
          ),
        );
      }

      // Fetch podcasts if requested or if no specific content type is specified
      if (!contentType || contentType === ContentType.PODCAST) {
        const podcastQuery = genres
          .map((genre) => `${genre} ${normalizedMood}`)
          .join(' OR ');
        const podcasts = await this.searchPodcasts(podcastQuery);
        content.push(
          ...podcasts.map((podcast) =>
            mapToContentEntity(podcast, ContentType.PODCAST, normalizedMood),
          ),
        );
      }

      if (content.length > 0) {
        this.cache.set(cacheKey, {
          data: content,
          timestamp: Date.now(),
        });
      }

      return content;
    } catch (error) {
      console.error('Error fetching Spotify content:', error.message);
      return [];
    }
  }
}
