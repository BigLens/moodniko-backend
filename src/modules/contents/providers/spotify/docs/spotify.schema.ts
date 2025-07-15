import { ApiProperty } from '@nestjs/swagger';
import { SpotifyContentType } from '@modules/contents/providers/spotify/enum/spotify-content.enum';

export class SpotifyContentResponse {
  @ApiProperty({
    description: 'Unique identifier for the content',
    example: '1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the content (track name or podcast show name)',
    example: 'Shape of You',
  })
  title: string;

  @ApiProperty({
    description: 'Artist name for music or publisher for podcasts',
    example: 'Ed Sheeran',
  })
  artist: string;

  @ApiProperty({
    description: 'Type of content (music or podcast)',
    enum: SpotifyContentType,
    example: SpotifyContentType.MUSIC,
  })
  type: SpotifyContentType;

  @ApiProperty({
    description: 'URL to the content on Spotify',
    example: 'https://open.spotify.com/track/1234567890',
  })
  url: string;

  @ApiProperty({
    description: 'URL to the content thumbnail image',
    example: 'https://i.scdn.co/image/1234567890',
  })
  thumbnailUrl: string;

  @ApiProperty({
    description: 'Duration of the content in milliseconds',
    example: 235000,
  })
  duration: number;

  @ApiProperty({
    description: 'The mood associated with this content',
    example: 'happy',
  })
  mood: string;

  @ApiProperty({
    description: 'Additional metadata for the content',
    example: {
      album: '÷ (Divide)',
      releaseDate: '2017-03-03',
      popularity: 95,
    },
  })
  metadata: Record<string, any>;
}
