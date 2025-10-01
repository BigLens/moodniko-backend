import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MoodDto } from '@modules/mood/dto/mood.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { UserEntity } from '@modules/user/entity/user.entity';

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntity)
    private moodRepo: Repository<MoodEntity>,
  ) {}

  async createMood(dto: MoodDto, userId: number): Promise<MoodEntity> {
    const mood = this.moodRepo.create({
      feeling: dto.feeling,
      user: { id: userId }
    });
    return await this.moodRepo.save(mood);
  }

  async findAllMood(user: UserEntity): Promise<MoodEntity[]> {
    return await this.moodRepo.find({ where: { user: { id: user.id } } });
  }

  async findMoodById(id: number, user: UserEntity): Promise<MoodEntity> {
    const mood = await this.moodRepo.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!mood) {
      throw new NotFoundException('Mood not found');
    }
    return mood;
  }

  async updateMood(
    id: number,
    dto: MoodDto,
    user: UserEntity,
  ): Promise<MoodEntity> {
    const mood = await this.findMoodById(id, user);
    mood.feeling = dto.feeling;
    return await this.moodRepo.save(mood);
  }

  async deleteMood(id: number, user: UserEntity): Promise<{ message: string }> {
    const mood = await this.findMoodById(id, user);
    const result = await this.moodRepo.delete(mood.id);
    if (!result.affected) {
      throw new NotFoundException('Mood not found');
    }
    return { message: 'Mood deleted successfully' };
  }
}
