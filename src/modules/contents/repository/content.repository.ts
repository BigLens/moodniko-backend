import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentEntity } from '../model/content.entity';
import { ContentType } from '../enum/content.enum';

@Injectable()
export class ContentRepository {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly repository: Repository<ContentEntity>,
  ) {}

  async findByExternalId(
    externalId: string,
    type: ContentType,
  ): Promise<ContentEntity | null> {
    return this.repository.findOne({
      where: { externalId, type },
    });
  }

  async save(content: ContentEntity): Promise<ContentEntity> {
    return this.repository.save(content);
  }

  async saveMany(contents: ContentEntity[]): Promise<ContentEntity[]> {
    return this.repository.save(contents);
  }
}
