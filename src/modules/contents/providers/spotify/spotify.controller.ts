import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { ContentEntity } from '@modules/contents/model/content.entity';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('mood')
  async getContentByMood(
    @Query('mood') mood: string,
  ): Promise<ContentEntity[]> {
    return this.spotifyService.fetchContentByMood(mood);
  }
}
