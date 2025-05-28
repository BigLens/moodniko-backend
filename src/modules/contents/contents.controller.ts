import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentsService } from './contents.service';
import { GetContentsQueryDto } from './dto/get-contents-query.dto';
import { ContentEntity } from './model/content.entity';
import { GetContentDoc } from './docs/get-content.doc';

@ApiTags('contents')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  @GetContentDoc()
  async getContents(
    @Query(new ValidationPipe({ transform: true }))
    query: GetContentsQueryDto,
  ): Promise<ContentEntity[]> {
    return this.contentsService.getContentByMood(query.mood, query.type);
  }
}
