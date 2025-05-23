import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { ApiSpotifyContent } from './docs/spotify.swagger';
import { mapContentTypeToSpotifyType } from './mappers/spotify-type.mapper';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('mood')
  @ApiSpotifyContent()
  async getContentByMood(
    @Query('mood') mood: string,
    @Query('contentType') type?: ContentType,
  ): Promise<ContentEntity[]> {
    const spotifyContentType = mapContentTypeToSpotifyType(type);
    return await this.spotifyService.fetchContentByMood(
      mood,
      spotifyContentType,
    );
  }
}
