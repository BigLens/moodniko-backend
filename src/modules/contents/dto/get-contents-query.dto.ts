import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContentType } from '../enum/content.enum';

export class GetContentsQueryDto {
  @IsNotEmpty()
  @IsString()
  mood: string;

  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType;
}
