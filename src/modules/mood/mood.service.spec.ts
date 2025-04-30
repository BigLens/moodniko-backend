import { Test, TestingModule } from '@nestjs/testing';
import { MoodService } from '@modules/mood/mood.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockMood = { id: 1, feeling: 'Happy' };

describe('MoodService', () => {
  let service: MoodService;
  let repo: Repository<MoodEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoodService,
        {
          provide: getRepositoryToken(MoodEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockMood),
            save: jest.fn().mockResolvedValue(mockMood),
            find: jest.fn().mockResolvedValue([mockMood]),
            findOne: jest.fn().mockResolvedValue(mockMood),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();
    service = module.get<MoodService>(MoodService);
    repo = module.get<Repository<MoodEntity>>(getRepositoryToken(MoodEntity));
  });
  it('should create a mood', async () => {
    const result = await service.createMood({ feeling: 'Happy' });
    expect(repo.create).toHaveBeenCalledWith({ feeling: 'Happy' });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockMood);
  });
  it('should find all moods', async () => {
    const result = await service.findAllMood();
    expect(result).toEqual([mockMood]);
  });
  it('should find a mood by id', async () => {
    const result = await service.findMoodById(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockMood);
  });
  it('should throw if mood not found by id', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    await expect(service.findMoodById(2)).rejects.toThrow(NotFoundException);
  });
  it('should update a mood', async () => {
    const result = await service.updateMood(1, { feeling: 'Excited' });
    expect(result).toEqual(mockMood);
  });
  it('should delete a mood', async () => {
    const result = await service.deleteMood(1);
    expect(result).toEqual({ message: 'Mood deleted successfully' });
  });
  it('should throw if delete fails', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0, raw: {} });
    await expect(service.deleteMood(999)).rejects.toThrow(NotFoundException);
  });
});
