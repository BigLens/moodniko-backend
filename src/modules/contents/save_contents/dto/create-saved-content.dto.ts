import { IsInt, IsEnum, IsNotEmpty } from 'class-validator';
import { Mood } from '../enum/mood.enum';

export class CreateSavedContentDto {
  @IsNotEmpty()
  @IsInt()
  contentId: number;

  @IsNotEmpty()
  @IsEnum(Mood)
  mood: Mood;
}
