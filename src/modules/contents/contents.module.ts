import { Module } from '@nestjs/common';
import { ContentsService } from '@modules/contents/contents.service';
import { ContentsController } from '@modules/contents/contents.controller';

@Module({
  providers: [ContentsService],
  controllers: [ContentsController],
})
export class ContentsModule {}
