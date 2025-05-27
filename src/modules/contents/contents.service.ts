import { Injectable } from '@nestjs/common';
import { ContentType } from '@modules/contents/enum/content.enum';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { MoviesService } from './providers/movies/movies.service';
import { SpotifyService } from './providers/spotify/spotify.service';
import { BooksService } from './providers/books/books.service';
import { mapContentTypeToSpotifyType } from './providers/spotify/mappers/content-type.mapper';
import { ContentRepository } from './repository/content.repository';

@Injectable()
export class ContentsService {
  constructor(
    private moviesService: MoviesService,
    private spotifyService: SpotifyService,
    private booksService: BooksService,
    private contentRepository: ContentRepository,
  ) {}

  private async deduplicateAndSaveContents(
    contents: ContentEntity[],
  ): Promise<ContentEntity[]> {
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

  async getContentsByMood(
    mood: string,
    type: ContentType,
  ): Promise<ContentEntity[]> {
    let contents: ContentEntity[];

    if (type === ContentType.MOVIE) {
      contents = await this.moviesService.fetchMoviesByMood(mood);
    } else if (type === ContentType.MUSIC || type === ContentType.PODCAST) {
      const spotifyType = mapContentTypeToSpotifyType(type);
      contents = await this.spotifyService.fetchContentByMood(
        mood,
        spotifyType,
      );
    } else if (type === ContentType.BOOK) {
      contents = await this.booksService.fetchBooksByMood(mood);
    } else {
      throw new Error(`Invalid content type: ${type}`);
    }

    return this.deduplicateAndSaveContents(contents);
  }
}
