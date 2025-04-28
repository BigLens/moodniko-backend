import { Controller, Post, Get, Body} from '@nestjs/common';
import { MoodService } from '@modules/mood/mood.service';
import { MoodDto } from '@modules/mood/dto/mood.dto';

@Controller('moods')
export class MoodController {
	constructor(
		private moodService: MoodService
	){}

	@Post('/create-mood')
	async createMood(@Body() dto:MoodDto) {
		return this.moodService.createMood(dto)
	}

	@Get('get-moods')
	async findAllMood() {
		return this.moodService.findAllMood
	}
}
