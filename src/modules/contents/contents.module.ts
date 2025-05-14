import { Module } from '@nestjs/common';
import { ContentsService } from '@modules/contents/contents.service';
import { ContentsController } from '@modules/contents/contents.controller';
import { MoviesModule } from '@modules/contents/providers/movies/movies.module';
import { SpotifyModule } from '@modules/contents/providers/spotify/spotify.module';

@Module({
  imports: [MoviesModule, SpotifyModule],
  providers: [ContentsService],
  controllers: [ContentsController],
})
export class ContentsModule {}
