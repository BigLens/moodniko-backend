import { ContentEntity } from '@modules/contents/model/content.entity';
import { ContentType } from '@modules/contents/enum/content.enum';
import { GoogleBook } from './interface/books.interface';

export function mapToContentEntity(
  book: GoogleBook,
  type: ContentType,
  mood: string,
): ContentEntity {
  const entity = new ContentEntity();
  entity.externalId = book.id
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  entity.title = book.volumeInfo.title || '';
  entity.description = book.volumeInfo.description || '';
  entity.imageUrl =
    book.volumeInfo.imageLinks?.thumbnail ||
    book.volumeInfo.imageLinks?.smallThumbnail ||
    null;
  entity.type = type;
  entity.moodtag = mood;

  return entity;
}
