import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { SpotifyTrack, SpotifyPodcast } from './interface/spotify.interface';

export const mapToContentEntity = (
  item: SpotifyTrack | SpotifyPodcast,
  type: ContentType,
  mood: string,
): ContentEntity => {
  const content = new ContentEntity();

  if (type === ContentType.MUSIC) {
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

  content.type = type;
  return content;
};
