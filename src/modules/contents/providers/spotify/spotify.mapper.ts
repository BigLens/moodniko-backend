import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { SpotifyTrack, SpotifyPodcast } from './interface/spotify.interface';

export function mapTrackToContentEntity(
  track: SpotifyTrack,
  type: ContentType,
  mood: string,
): ContentEntity {
  const content = new ContentEntity();
  content.externalId = track.id;
  content.title = track.name;
  content.description = track.artists.map((artist) => artist.name).join(', ');
  content.imageUrl = track.album.images[0]?.url || '';
  content.type = type;
  content.moodtag = mood;
  return content;
}

export function mapPodcastToContentEntity(
  podcast: SpotifyPodcast,
  type: ContentType,
  mood: string,
): ContentEntity {
  const content = new ContentEntity();
  content.externalId = podcast.id;
  content.title = podcast.name;
  content.description = podcast.description || '';
  content.imageUrl = podcast.images[0]?.url || '';
  content.type = type;
  content.moodtag = mood;
  return content;
}
