import { Test, TestingModule } from '@nestjs/testing';
import { MoodService } from '@modules/mood/mood.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { UserEntity } from '@modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUser: UserEntity = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  moods: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMood: MoodEntity = {
  id: 1,
  feeling: 'Happy',
  intensity: 7,
  context: 'Test context',
  triggers: ['test trigger'],
  notes: 'Test notes',
  location: 'Test location',
  weather: 'Sunny',
  activity: 'Testing',
  socialContext: 'Alone',
  energyLevel: 8,
  stressLevel: 2,
  sleepQuality: 7,
  moodDurationMinutes: 120,
  moodChangeReason: 'Test reason',
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
    const result = await service.createMood({ feeling: 'Happy' }, 1);
    expect(repo.create).toHaveBeenCalledWith({
      feeling: 'Happy',
      user: { id: 1 },
    });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockMood);
  });

  it('should find all moods for a user', async () => {
    const result = await service.findAllMood(mockUser);
    expect(repo.find).toHaveBeenCalledWith({
      where: { user: { id: mockUser.id } },
    });
    expect(result).toEqual([mockMood]);
  });

  it('should find a mood by id for a user', async () => {
    const result = await service.findMoodById(1, mockUser);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1, user: { id: mockUser.id } },
    });
    expect(result).toEqual(mockMood);
  });

  it('should throw if mood not found by id for user', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    await expect(service.findMoodById(2, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a mood for a user', async () => {
    const result = await service.updateMood(
      1,
      { feeling: 'Excited' },
      mockUser,
    );
    expect(result).toEqual(mockMood);
  });

  it('should delete a mood for a user', async () => {
    const result = await service.deleteMood(1, mockUser);
    expect(result).toEqual({ message: 'Mood deleted successfully' });
  });

  it('should throw if delete fails for user', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0, raw: {} });
    await expect(service.deleteMood(999, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
