import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { mapToContentEntity } from '@modules/contents/providers/books/books.mapper';
import { GoogleBooksResponse } from '@modules/contents/providers/books/interface/books.interface';
import { moodToGenreMap } from '@modules/contents/providers/books/mood-mapping';

@Injectable()
export class BooksService {
  private readonly GOOGLE_BOOKS_URL =
    'https://www.googleapis.com/books/v1/volumes';
  private readonly cache = new Map<
    string,
    { data: ContentEntity[]; timestamp: number }
  >();
  private readonly CACHE_TTL = 3600000;
  private readonly REQUEST_TIMEOUT = 8000;
  private readonly MAX_RESULTS = 20;

  constructor(private readonly http: HttpService) {}

  //function to fetch books based on mood
  async fetchBooksByMood(mood: string): Promise<ContentEntity[]> {
    if (!mood?.trim()) {
      throw new BadRequestException('Mood parameter is required');
    }

    if (!process.env.GOOGLE_BOOKS_API_KEY) {
      throw new InternalServerErrorException(
        'Google Books API key is not configured',
      );
    }

    const normalizedMood = mood.toLowerCase().trim();
    const cacheKey = `books:mood:${normalizedMood}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const moodConfig = moodToGenreMap[normalizedMood];
    if (!moodConfig) {
      return [];
    }

    try {
      const { genres } = moodConfig;
      const searchQuery = genres.join(' ');
      const params = {
        q: searchQuery,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: this.MAX_RESULTS,
        langRestrict: 'en',
        printType: 'books',
        orderBy: 'relevance',
      };

      const { data } = await firstValueFrom(
        this.http
          .get<GoogleBooksResponse>(this.GOOGLE_BOOKS_URL, {
            params,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .pipe(timeout(this.REQUEST_TIMEOUT)),
      );

      const books = (data.items || [])
        .filter(
          (book) =>
            book.volumeInfo.imageLinks?.thumbnail ||
            book.volumeInfo.imageLinks?.smallThumbnail,
        )
        .map((book) =>
          mapToContentEntity(book, ContentType.BOOK, normalizedMood),
        );

      if (books.length > 0) {
        this.cache.set(cacheKey, {
          data: books,
          timestamp: Date.now(),
        });
      }

      return books;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          params: error.config?.params,
          headers: error.config?.headers,
        },
      });

      if (error.response?.status === 403) {
        throw new InternalServerErrorException(
          `Google Books API error: ${error.response?.data?.error?.message || 'Invalid API key or insufficient permissions'}`,
        );
      }
      if (error.response?.status === 429) {
        throw new InternalServerErrorException(
          'Google Books API quota exceeded',
        );
      }
      return [];
    }
  }
}
