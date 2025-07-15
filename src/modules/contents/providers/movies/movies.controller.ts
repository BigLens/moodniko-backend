import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from '@modules/contents/providers/movies/movies.service';
import {
  MovieApiTags,
  GetMoviesByMoodDocs,
} from '@modules/contents/providers/movies/docs/movie-docs';

@Controller('movies')
@MovieApiTags()
export class MovieController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  @GetMoviesByMoodDocs()
  async getMoviesByMood(@Query('mood') mood: string) {
    return this.movieService.fetchMoviesByMood(mood);
  }
}
