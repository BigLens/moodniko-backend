import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { mapToContentEntity } from '@modules/contents/providers/movies/movies.mapper';
import { TmdbMovie } from '@modules/contents/providers/movies/interface/movie.interface';
import { moodToGenreMap, emotionalImpactParams } from '@modules/contents/providers/movies/mood-mapping';

@Injectable()
export class MoviesService {
  private readonly TMDB_URL = 'https://api.themoviedb.org/3/discover/movie';
  private readonly SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
  private readonly cache = new Map<
    string,
    { data: ContentEntity[]; timestamp: number }
  >();
  private readonly CACHE_TTL = 3600000;
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 1000;
  private readonly REQUEST_TIMEOUT = 8000;

  constructor(private readonly http: HttpService) {}

  async fetchMoviesByMood(mood: string): Promise<ContentEntity[]> {
    // Essential input validation
    if (!mood?.trim()) {
      throw new BadRequestException('Mood parameter is required');
    }

    // Validate API key
    if (!process.env.TMDB_API_KEY) {
      throw new InternalServerErrorException('TMDB API key is not configured');
    }

    // Check cache
    const cacheKey = `mood:${mood}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Normalize mood and get configuration
    const normalizedMood = mood.toLowerCase().trim();
    const moodConfig = moodToGenreMap[normalizedMood];

    // If mood doesn't exist in our mapping, return empty array immediately
    if (!moodConfig) {
      console.log(`No mapping found for mood: ${mood}`);
      return [];
    }

    try {
      let movies: ContentEntity[] = [];
      let retryCount = 0;

      // If we have a mood configuration, use it
      const { genres, effect } = moodConfig;
      const impactParams = emotionalImpactParams[effect];

      const params = {
        api_key: process.env.TMDB_API_KEY,
        with_genres: genres.join(','),
        ...impactParams,
      };

      while (retryCount < this.MAX_RETRIES) {
        try {
          const { data, status } = await firstValueFrom(
            this.http
              .get<{ results: TmdbMovie[] }>(this.TMDB_URL, { params })
              .pipe(
                timeout(this.REQUEST_TIMEOUT),
                catchError((error) => {
                  console.error(
                    `Attempt ${retryCount + 1} failed:`,
                    error.message,
                  );
                  throw error;
                }),
              ),
          );

          if (status === 200 && data.results?.length > 0) {
            movies = data.results.map((movie) =>
              mapToContentEntity(movie, ContentType.MOVIE, mood),
            );
            break;
          }
        } catch (error) {
          retryCount++;
          if (retryCount === this.MAX_RETRIES) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        }
      }

      // If no results from mood mapping, try a general search
      if (movies.length === 0) {
        retryCount = 0;
        const searchParams = {
          api_key: process.env.TMDB_API_KEY,
          query: normalizedMood,
          include_adult: false,
          language: 'en-US',
          'vote_average.gte': 6,
          'vote_count.gte': 500,
        };

        while (retryCount < this.MAX_RETRIES) {
          try {
            const { data, status } = await firstValueFrom(
              this.http
                .get<{
                  results: TmdbMovie[];
                }>(this.SEARCH_URL, { params: searchParams })
                .pipe(
                  timeout(this.REQUEST_TIMEOUT),
                  catchError((error) => {
                    console.error(
                      `Search attempt ${retryCount + 1} failed:`,
                      error.message,
                    );
                    throw error;
                  }),
                ),
            );

            if (status === 200 && data.results?.length > 0) {
              movies = data.results.map((movie) =>
                mapToContentEntity(movie, ContentType.MOVIE, mood),
              );
              break;
            }
          } catch (error) {
            retryCount++;
            if (retryCount === this.MAX_RETRIES) {
              throw error;
            }
            await new Promise((resolve) =>
              setTimeout(resolve, this.RETRY_DELAY),
            );
          }
        }
      }

      // Cache the results
      if (movies.length > 0) {
        this.cache.set(cacheKey, {
          data: movies,
          timestamp: Date.now(),
        });
      }

      return movies;
    } catch (error) {
      // Handle timeout errors
      if (error.name === 'TimeoutError') {
        console.error('Request timed out:', error.message);
        return [];
      }

      // Simplified error handling focusing on critical cases
      if (error.response?.status === 401) {
        throw new InternalServerErrorException('Invalid TMDB API key');
      }
      if (error.response?.status === 429) {
        throw new InternalServerErrorException('TMDB API rate limit exceeded');
      }

      console.error('Error fetching movies:', error.message);
      return [];
    }
  }
}
