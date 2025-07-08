import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContentType } from '@modules/contents/enum/content.enum';

export class GetContentsQueryDto {
  @IsNotEmpty()
  @IsString()
  mood: string;

  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType;
}
