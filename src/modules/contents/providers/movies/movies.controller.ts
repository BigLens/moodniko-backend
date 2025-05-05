import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  async getMoviesByMood(@Query('mood') mood: string) {
    return this.movieService.fetchMoviesByMood(mood);
  }
}
