import { ContentEntity } from '@modules/contents/model/content.entity';
import { GoogleBook } from './interface/books.interface';
import { ContentType } from '@modules/contents/enum/content.enum';

export function mapToContentEntity(
  book: GoogleBook,
  type: ContentType,
  mood: string,
): ContentEntity {
  const entity = new ContentEntity();
  entity.externalId = book.id;
  entity.title = book.volumeInfo.title || '';
  entity.description = book.volumeInfo.description || '';
  entity.imageUrl = book.volumeInfo.imageLinks?.thumbnail || '';
  entity.type = type;
  entity.moodtag = mood;

  return entity; // Return the mapped entity
}
