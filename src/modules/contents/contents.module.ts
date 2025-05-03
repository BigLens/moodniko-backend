import { Module } from '@nestjs/common';
import { ContentsService } from '@modules/contents/contents.service';
import { ContentsController } from '@modules/contents/contents.controller';
import { MoviesModule } from '@modules/contents/movies/movies.module';

@Module({
  providers: [ContentsService],
  controllers: [ContentsController],
  imports: [MoviesModule],
})
export class ContentsModule {}
