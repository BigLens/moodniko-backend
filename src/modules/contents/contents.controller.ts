import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentsService } from './contents.service';
import { GetContentQueryDto } from './dto/get-content-query.dto';
import { ContentEntity } from './model/content.entity';
import { GetContentDoc } from './docs/get-content.doc';

@ApiTags('contents')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  @GetContentDoc()
  async getContentByMood(
    @Query(new ValidationPipe({ transform: true }))
    query: GetContentQueryDto,
  ): Promise<ContentEntity[]> {
    return this.contentsService.getContentsByMood(query.mood, query.type);
  }
}
