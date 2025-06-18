import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { ContentEntity } from './model/content.entity';
import { MoviesModule } from './providers/movies/movies.module';
import { SpotifyModule } from './providers/spotify/spotify.module';
import { BooksModule } from './providers/books/books.module';
import { ContentRepository } from './repository/content.repository';
import { SaveContentModule } from './save_contents/save-content.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentEntity]),
    MoviesModule,
    SpotifyModule,
    BooksModule,
    SaveContentModule,
  ],
  controllers: [ContentsController],
  providers: [ContentsService, ContentRepository],
})
export class ContentsModule {}
