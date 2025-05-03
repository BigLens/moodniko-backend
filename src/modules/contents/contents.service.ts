import { Injectable } from '@nestjs/common';
import { ContentType } from './enum/content.enum';
import { ContentEntity } from './model/content.entity';

@Injectable()
export class ContentsService {
  constructor() {}

  async getContentsByMood(
    mood: string,
    type: ContentType,
  ): Promise<ContentEntity[]> {
    if (type === ContentType.MOVIE) {
      return [];
    } else if (type === ContentType.MUSIC || type === ContentType.PODCAST) {
      return [];
    } else if (type === ContentType.BOOK) {
      return [];
    } else throw new Error(`Invalid content type: ${type}`);
  }
}
