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
  ): Promise<SavedContent> {
    const { contentId, mood } = createSavedContentDto;
    // Validate mood length - this is now handled by the enum, but we can keep it as a safeguard
    if (mood.length > 50) {
      throw new BadRequestException('Mood must be 50 characters or less');
    }

    // Check if content exists
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // Check if already saved with same mood
    const existingSave = await this.savedContentRepository.findOne({
      where: { contentId, mood },
    });

    if (existingSave) {
      throw new BadRequestException('Content already saved with this mood');
    }

    // Create new saved content
    const savedContent = this.savedContentRepository.create({
      contentId,
      mood,
    });

    return await this.savedContentRepository.save(savedContent);
  }

  async getSavedContents(
    query: GetSavedContentsQueryDto,
  ): Promise<SavedContent[]> {
    const { mood, contentType, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.savedContentRepository.createQueryBuilder('savedContent');

    queryBuilder
      .leftJoinAndSelect('savedContent.content', 'content')
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

  async getSavedContentById(id: number): Promise<SavedContent> {
    const savedContent = await this.savedContentRepository.findOne({
      where: { id },
      relations: ['content'],
    });
    if (!savedContent) {
      throw new NotFoundException('Saved content not found');
    }
    return savedContent;
  }

  async removeSavedContent(contentId: number): Promise<{ message: string }> {
    const exists = await this.savedContentRepository.count({
      where: { contentId },
    });

    if (exists === 0) {
      throw new NotFoundException(
        'Fail deletion because the resource does not exist',
      );
    }

    await this.savedContentRepository.delete({ contentId });
    return { message: 'Resource deleted' };
  }

  async removeSavedContentById(id: number): Promise<{ message: string }> {
    const exists = await this.savedContentRepository.count({ where: { id } });
    if (exists === 0) {
      throw new NotFoundException(
        'Fail deletion because the resource does not exist',
      );
    }
    await this.savedContentRepository.delete({ id });
    return { message: 'Resource deleted' };
  }
}
