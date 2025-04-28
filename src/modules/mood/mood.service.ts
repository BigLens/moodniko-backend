import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MoodDto } from '@modules/mood/dto/mood.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodEntity } from '@modules/mood/entity/mood.entity';

@Injectable()
export class MoodService {
	constructor(
		@InjectRepository(MoodEntity)
		private moodRepo: Repository<MoodEntity>
	) {}

	async createMood(dto: MoodDto): Promise<MoodEntity>{
		const feeling = await this.moodRepo.create({
			feeling: dto.feeling
		});
		const saveFeeling = await this.moodRepo.save(feeling);
		return saveFeeling;
	}

	async findAllMood(): Promise<MoodEntity[]> {
		const findMoods = await this.moodRepo.find();
		return findMoods;
	}
}