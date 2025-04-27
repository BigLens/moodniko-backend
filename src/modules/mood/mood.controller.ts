import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { MoodService } from './mood.service';
import { MoodDto } from './dto/mood.dto'

@Controller('mood')
export class MoodController {
	constructor(
		private moodService: MoodService
	){}

	@Post()
	async createMood(@Body() dto:MoodDto) {
		return await this.moodService.createMood(dto)
	}

	@Get()
	async findAllMoods(Req() feeling: string) {
	return await this.moodService.findAll(feeling)	
	}
}
