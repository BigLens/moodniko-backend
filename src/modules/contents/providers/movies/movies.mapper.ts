import { ContentEntity } from '@modules/contents/model/content.entity';
import { TmdbMovie } from '@modules/contents/providers/movies/interface/movie.interface';
import { ContentType } from '@modules/contents/enum/content.enum';

export function mapToContentEntity(
  movie: TmdbMovie,
  type: ContentType,
  mood: string,
): ContentEntity {
  const entity = new ContentEntity();
  entity.externalId = movie.id.toString();
  entity.title = movie.title || movie.name || '';
  entity.description = movie.overview || '';
  entity.imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  entity.type = type;
  entity.moodtag = mood;

  return entity;
}
