import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferencesEntity } from './entity/user-preferences.entity';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreferencesEntity)
    private readonly preferencesRepo: Repository<UserPreferencesEntity>,
  ) {}

  async findByUserId(userId: number) {
    return this.preferencesRepo.findOne({ where: { user: { id: userId } } });
  }

  async createOrUpdate(userId: number, data: Partial<UserPreferencesEntity>) {
    let prefs = await this.findByUserId(userId);
    if (prefs) {
      Object.assign(prefs, data);
      return this.preferencesRepo.save(prefs);
    } else {
      prefs = this.preferencesRepo.create({ ...data, user: { id: userId } });
      return this.preferencesRepo.save(prefs);
    }
  }
}
