import { IsString, IsNotEmpty } from 'class-validator';

export class MoodDto {
	@IsString()
	@IsNotEmpty()
	feeling: string
}
