import { ContentType } from '@modules/contents/enum/content.enum';
import { SpotifyContentType } from '../enum/spotify-content.enum';

export const mapContentTypeToSpotifyType = (
  type: ContentType,
): SpotifyContentType => {
  if (type === ContentType.MUSIC) {
    return SpotifyContentType.MUSIC;
  }

  if (type === ContentType.PODCAST) {
    return SpotifyContentType.PODCAST;
  }

  return SpotifyContentType.BOTH;
};
