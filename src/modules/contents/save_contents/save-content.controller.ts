import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
} from '@nestjs/common';
import { SaveContentService } from './save-content.service';
import { SavedContent } from './save-content.entity';
import {
  SavedContentApiTags,
  SaveContentDocs,
  GetSavedContentsDocs,
  RemoveSavedContentDocs,
  GetSavedContentByIdDocs,
  RemoveSavedContentByIdDocs,
} from './docs/save-content.swagger';

@SavedContentApiTags()
@Controller('contents/saved-contents')
export class SaveContentController {
  constructor(private readonly saveContentService: SaveContentService) {}

  @Post()
  @SaveContentDocs()
  async saveContent(
    @Body('contentId') contentId: number,
    @Body('mood') mood: string,
  ): Promise<SavedContent> {
    return await this.saveContentService.saveContent(contentId, mood);
  }

  @Get()
  @GetSavedContentsDocs()
  async getSavedContents(
    @Query('mood') mood?: string,
    @Query('contentId') contentId?: number,
  ): Promise<SavedContent[]> {
    return await this.saveContentService.getSavedContents(mood, contentId);
  }

  @Get(':id')
  @GetSavedContentByIdDocs()
  async getSavedContentById(@Param('id') id: number): Promise<SavedContent> {
    return await this.saveContentService.getSavedContentById(id);
  }

  @Delete(':contentId')
  @HttpCode(200)
  @RemoveSavedContentDocs()
  async removeSavedContent(
    @Param('contentId') contentId: number,
  ): Promise<{ message: string }> {
    return await this.saveContentService.removeSavedContent(contentId);
  }

  @Delete('by-id/:id')
  @HttpCode(200)
  @RemoveSavedContentByIdDocs()
  async removeSavedContentById(
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    return await this.saveContentService.removeSavedContentById(id);
  }
}
