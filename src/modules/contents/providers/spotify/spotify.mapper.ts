import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { SpotifyContentType } from './enum/spotify-content.enum';
import { SpotifyTrack, SpotifyPodcast } from './interface/spotify.interface';

const mapSpotifyTypeToContentType = (type: SpotifyContentType): ContentType => {
  switch (type) {
    case SpotifyContentType.MUSIC:
      return ContentType.MUSIC;
    case SpotifyContentType.PODCAST:
      return ContentType.PODCAST;
    default:
      return ContentType.MUSIC; // Default to MUSIC for BOTH case
  }
};

export const mapToContentEntity = (
  item: SpotifyTrack | SpotifyPodcast,
  type: SpotifyContentType,
  mood: string,
): ContentEntity => {
  const content = new ContentEntity();

  if (type === SpotifyContentType.MUSIC) {
    const track = item as SpotifyTrack;
    content.externalId = parseInt(track.id, 10);
    content.title = track.name;
    content.description = `${track.artists.map((artist) => artist.name).join(', ')} - ${track.album.name}`;
    content.imageUrl = track.album.images[0]?.url || null;
    content.moodtag = mood;
  } else {
    const podcast = item as SpotifyPodcast;
    content.externalId = parseInt(podcast.id, 10);
    content.title = podcast.name;
    content.description = podcast.description;
    content.imageUrl = podcast.images[0]?.url || null;
    content.moodtag = mood;
  }

  content.type = mapSpotifyTypeToContentType(type);
  return content;
};
