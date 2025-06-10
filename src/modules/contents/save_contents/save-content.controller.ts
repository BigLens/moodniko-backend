import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { SaveContentService } from './save-content.service';
import { SavedContent } from './save-content.entity';

@Controller('contents/saved-contents')
export class SaveContentController {
  constructor(private readonly saveContentService: SaveContentService) {}

  @Post()
  async saveContent(
    @Body('contentId') contentId: number,
    @Body('mood') mood: string,
  ): Promise<SavedContent> {
    return await this.saveContentService.saveContent(contentId, mood);
  }

  @Get()
  async getSavedContents(): Promise<SavedContent[]> {
    return await this.saveContentService.getSavedContents();
  }

  @Delete(':contentId')
  async removeSavedContent(
    @Param('contentId') contentId: number,
  ): Promise<void> {
    await this.saveContentService.removeSavedContent(contentId);
  }
}
