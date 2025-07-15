import { Module } from '@nestjs/common';
import { MoviesService } from '@modules/contents/providers/movies/movies.service';
import { HttpModule } from '@nestjs/axios';
import { MovieController } from '@modules/contents/providers/movies/movies.controller';

@Module({
  imports: [HttpModule],
  controllers: [MovieController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
