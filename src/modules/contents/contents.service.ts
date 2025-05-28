import { Injectable } from '@nestjs/common';
import { ContentType } from '@modules/contents/enum/content.enum';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { MoviesService } from './providers/movies/movies.service';
import { SpotifyService } from './providers/spotify/spotify.service';
import { BooksService } from './providers/books/books.service';
import { ContentRepository } from './repository/content.repository';
import { SpotifyContentType } from './providers/spotify/enum/spotify-content.enum';

@Injectable()
export class ContentsService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly moviesService: MoviesService,
    private readonly spotifyService: SpotifyService,
    private readonly booksService: BooksService,
  ) {}

  async getContentByMood(
    mood: string,
    type: ContentType,
  ): Promise<ContentEntity[]> {
    let contents: ContentEntity[] = [];

    switch (type) {
      case ContentType.MOVIE:
        contents = await this.moviesService.fetchMoviesByMood(mood);
        break;
      case ContentType.MUSIC:
        contents = await this.spotifyService.fetchContentByMood(
          mood,
          SpotifyContentType.MUSIC,
        );
        break;
      case ContentType.PODCAST:
        contents = await this.spotifyService.fetchContentByMood(
          mood,
          SpotifyContentType.PODCAST,
        );
        break;
      case ContentType.BOOK:
        contents = await this.booksService.fetchBooksByMood(mood);
        break;
      default:
        throw new Error(`Invalid content type: ${type}`);
    }

    // Deduplicate and save contents
    const savedContents: ContentEntity[] = [];
    for (const content of contents) {
      const existingContent = await this.contentRepository.findByExternalId(
        content.externalId,
        content.type,
      );
      if (existingContent) {
        savedContents.push(existingContent);
      } else {
        const savedContent = await this.contentRepository.save(content);
        savedContents.push(savedContent);
      }
    }

    return savedContents;
  }
}
