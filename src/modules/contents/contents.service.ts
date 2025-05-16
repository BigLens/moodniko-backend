import { Injectable } from '@nestjs/common';
import { ContentType } from '@modules/contents/enum/content.enum';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { MoviesService } from './providers/movies/movies.service';
import { SpotifyService } from './providers/spotify/spotify.service';
import { BooksService } from './providers/books/books.service';

@Injectable()
export class ContentsService {
  constructor(
    private moviesService: MoviesService,
    private spotifyService: SpotifyService,
    private booksService: BooksService,
  ) {}

  async getContentsByMood(
    mood: string,
    type: ContentType,
  ): Promise<ContentEntity[]> {
    if (type === ContentType.MOVIE) {
      return await this.moviesService.fetchMoviesByMood(mood);
    } else if (type === ContentType.MUSIC || type === ContentType.PODCAST) {
      return await this.spotifyService.fetchContentByMood(mood, type);
    } else if (type === ContentType.BOOK) {
      return await this.booksService.fetchBooksByMood(mood);
    } else throw new Error(`Invalid content type: ${type}`);
  }
}
