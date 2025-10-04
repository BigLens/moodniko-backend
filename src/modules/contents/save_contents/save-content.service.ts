import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedContent } from './save-content.entity';
import { ContentEntity } from '../model/content.entity';
import { CreateSavedContentDto } from './dto/create-saved-content.dto';
import { GetSavedContentsQueryDto } from './dto/get-saved-contents-query.dto';

@Injectable()
export class SaveContentService {
  constructor(
    @InjectRepository(SavedContent)
    private readonly savedContentRepository: Repository<SavedContent>,
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
  ) {}

  async saveContent(
    createSavedContentDto: CreateSavedContentDto,
    userId: number,
  ): Promise<SavedContent> {
    const { contentId, mood } = createSavedContentDto;

    // Validate mood length
    if (mood && mood.length > 50) {
      throw new BadRequestException('Mood cannot exceed 50 characters');
    }

    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const existingSave = await this.savedContentRepository.findOne({
      where: { contentId, mood, userId },
    });

    if (existingSave) {
      throw new BadRequestException('Content already saved with this mood');
    }

    const savedContent = this.savedContentRepository.create({
      contentId,
      mood,
      userId,
    });

    return await this.savedContentRepository.save(savedContent);
  }

  async getSavedContents(
    query: GetSavedContentsQueryDto,
    userId: number,
  ): Promise<SavedContent[]> {
    const { mood, contentType, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.savedContentRepository.createQueryBuilder('savedContent');

    queryBuilder
      .leftJoinAndSelect('savedContent.content', 'content')
      .where('savedContent.userId = :userId', { userId })
      .orderBy('savedContent.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (mood) {
      queryBuilder.andWhere('savedContent.mood = :mood', { mood });
    }

    if (contentType) {
      queryBuilder.andWhere('content.type = :contentType', { contentType });
    }

    return await queryBuilder.getMany();
  }

  async getSavedContentById(id: number, userId: number): Promise<SavedContent> {
    const savedContent = await this.savedContentRepository.findOne({
      where: { id, userId },
      relations: ['content'],
    });
    if (!savedContent) {
      throw new NotFoundException('Saved content not found');
    }
    return savedContent;
  }

  async removeSavedContent(
    contentId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const exists = await this.savedContentRepository.count({
      where: { contentId, userId },
    });

    if (exists === 0) {
      throw new NotFoundException(
        'Fail deletion because the resource does not exist',
      );
    }

    await this.savedContentRepository.delete({ contentId, userId });
    return { message: 'Resource deleted' };
  }

  async removeSavedContentById(
    id: number,
    userId: number,
  ): Promise<{ message: string }> {
    const exists = await this.savedContentRepository.count({
      where: { id, userId },
    });
    if (exists === 0) {
      throw new NotFoundException(
        'Fail deletion because the resource does not exist',
      );
    }
    await this.savedContentRepository.delete({ id, userId });
    return { message: 'Resource deleted' };
  }
}
