import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContentType } from '../enum/content.enum';

export class GetContentQueryDto {
  @IsString()
  @IsNotEmpty()
  mood: string;

  @IsEnum(ContentType)
  @IsNotEmpty()
  type: ContentType;
}
