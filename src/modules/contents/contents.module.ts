import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { MoviesModule } from './movies/movies.module';

@Module({
  providers: [ContentsService],
  controllers: [ContentsController],
  imports: [MoviesModule],
})
export class ContentsModule {}
