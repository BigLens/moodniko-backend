import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MoodDto } from '@modules/mood/dto/mood.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodEntity } from '@modules/mood/entity/mood.entity';

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntity)
    private moodRepo: Repository<MoodEntity>,
  ) {}

  async createMood(dto: MoodDto): Promise<MoodEntity> {
    const feeling = await this.moodRepo.create({
      feeling: dto.feeling,
    });
    const saveFeeling = await this.moodRepo.save(feeling);
    return saveFeeling;
  }

  async findAllMood(): Promise<MoodEntity[]> {
    return await this.moodRepo.find();
  }

  async findMoodById(id: number): Promise<MoodEntity> {
    const mood = await this.moodRepo.findOne({where: { id }});
    if (!mood) {
      throw new NotFoundException('Mood not found');
    }
    return mood;
  }

  async updateMood(id: number, dto: MoodDto): Promise<MoodEntity> {
    const mood = await this.findMoodById(id);
    mood.feeling = dto.feeling;
    return await this.moodRepo.save(mood);
  }

  async deleteMood(id: number): Promise<{ message: string }> {
    const mood = await this.moodRepo.delete(id);
    if (!mood.affected) {
      throw new NotFoundException('Mood not found');
    }
    return { message: 'Mood deleted successfully' };
  }
}
