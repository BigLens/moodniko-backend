import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MoodDto } from './dto/mood.dto';
import { MoodEntity } from './entity/mood.entity';

@Injectable()
export class MoodService {
	constructor(
		@InjectRepository(MoodEntity),
		private moodRepo: Repository([MoodEntity])) {}

	async createMood(dto: MoodDto): Promise<string>{
		const feeling = await this.moodRepo.create({
			feeling: dto.feeling;
		});
		return feeling;
	}

	async findAllMood(feeling: string) {
		const findMoods = await this.moodRepo.find({
			where: {
				feeling: feeling;
			}
		});
		return findMoods;
	}
}
