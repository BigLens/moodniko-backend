import { Injectable } from '@nestjs/common';
import { ContentType } from '@modules/contents/enum/content.enum';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { MoviesService } from './providers/movies/movies.service';

@Injectable()
export class ContentsService {
  constructor(private moviesService: MoviesService) {}

  async getContentsByMood(
    mood: string,
    type: ContentType,
  ): Promise<ContentEntity[]> {
    if (type === ContentType.MOVIE) {
      return await this.moviesService.fetchMoviesByMood(mood);
    } else if (type === ContentType.MUSIC || type === ContentType.PODCAST) {
      return [];
    } else if (type === ContentType.BOOK) {
      return [];
    } else throw new Error(`Invalid content type: ${type}`);
  }
}
