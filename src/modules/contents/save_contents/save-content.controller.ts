import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  UseGuards,
  Request,
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
import { CreateSavedContentDto } from './dto/create-saved-content.dto';
import { GetSavedContentsQueryDto } from './dto/get-saved-contents-query.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@SavedContentApiTags()
@ApiBearerAuth('JWT-auth')
@Controller('contents/saved-contents')
@UseGuards(JwtAuthGuard)
export class SaveContentController {
  constructor(private readonly saveContentService: SaveContentService) {}

  @Post()
  @SaveContentDocs()
  async saveContent(
    @Body() createSavedContentDto: CreateSavedContentDto,
    @Request() req,
  ): Promise<SavedContent> {
    return await this.saveContentService.saveContent(
      createSavedContentDto,
      req.user.userId,
    );
  }

  @Get()
  @GetSavedContentsDocs()
  async getSavedContents(
    @Query() query: GetSavedContentsQueryDto,
    @Request() req,
  ): Promise<SavedContent[]> {
    return await this.saveContentService.getSavedContents(
      query,
      req.user.userId,
    );
  }

  @Get(':id')
  @GetSavedContentByIdDocs()
  async getSavedContentById(
    @Param('id') id: number,
    @Request() req,
  ): Promise<SavedContent> {
    return await this.saveContentService.getSavedContentById(
      id,
      req.user.userId,
    );
  }

  @Delete(':contentId')
  @HttpCode(200)
  @RemoveSavedContentDocs()
  async removeSavedContent(
    @Param('contentId') contentId: number,
    @Request() req,
  ): Promise<{ message: string }> {
    return await this.saveContentService.removeSavedContent(
      contentId,
      req.user.userId,
    );
  }

  @Delete('by-id/:id')
  @HttpCode(200)
  @RemoveSavedContentByIdDocs()
  async removeSavedContentById(
    @Param('id') id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    return await this.saveContentService.removeSavedContentById(
      id,
      req.user.userId,
    );
  }
}
