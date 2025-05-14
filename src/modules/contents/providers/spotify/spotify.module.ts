import { Module } from '@nestjs/common';
import { SpotifyService } from '@modules/contents/providers/spotify/spotify.service';
import { HttpModule } from '@nestjs/axios';
import { SpotifyController } from './spotify.controller';

@Module({
  imports: [HttpModule],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
