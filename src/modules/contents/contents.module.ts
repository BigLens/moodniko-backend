import { Module } from '@nestjs/common';
import { ContentsService } from '@modules/contents/contents.service';
import { ContentsController } from '@modules/contents/contents.controller';
import { MoviesModule } from '@modules/contents/providers/movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [ContentsService],
  controllers: [ContentsController],
})
export class ContentsModule {}
