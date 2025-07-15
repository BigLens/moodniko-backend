import { ContentType } from '@modules/contents/enum/content.enum';
import { SpotifyContentType } from '@modules/contents/providers/spotify/enum/spotify-content.enum';

export const mapContentTypeToSpotifyType = (
  type?: ContentType,
): SpotifyContentType | undefined => {
  if (!type) {
    return undefined;
  }

  if (type === ContentType.MUSIC) {
    return SpotifyContentType.MUSIC;
  }

  if (type === ContentType.PODCAST) {
    return SpotifyContentType.PODCAST;
  }

  return SpotifyContentType.BOTH;
};
