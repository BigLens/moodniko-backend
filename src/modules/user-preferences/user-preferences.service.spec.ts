import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesEntity } from './entity/user-preferences.entity';
import { Repository } from 'typeorm';
import { TestAuthUtils, MockUser } from '../../../test/test-utils';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let repository: Repository<UserPreferencesEntity>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  // Mock user for testing
  const mockUser: MockUser = TestAuthUtils.createMockUser();

  const mockUserPreferences: UserPreferencesEntity = {
    id: 1,
    user: {
      id: mockUser.id,
      email: mockUser.email,
      password: mockUser.password,
      moods: [],
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    },
    theme: 'dark',
    notificationsEnabled: true,
    preferredContentTypes: ['movie', 'music'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPreferencesService,
        {
          provide: getRepositoryToken(UserPreferencesEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserPreferencesService>(UserPreferencesService);
    repository = module.get<Repository<UserPreferencesEntity>>(
      getRepositoryToken(UserPreferencesEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('should find user preferences by user ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);

      const result = await service.findByUserId(mockUser.id);

      expect(result).toEqual(mockUserPreferences);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
    });

    it('should return null when user preferences not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUserId(999);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 999 } },
      });
    });

    it('should handle different user IDs', async () => {
      const differentUser = TestAuthUtils.createMockUser({
        id: 2,
        email: 'user2@example.com',
      });

      const differentPreferences = {
        ...mockUserPreferences,
        id: 2,
        user: {
          id: differentUser.id,
          email: differentUser.email,
          password: differentUser.password,
          moods: [],
          createdAt: differentUser.createdAt,
          updatedAt: differentUser.updatedAt,
        },
      };

      mockRepository.findOne.mockResolvedValue(differentPreferences);

      const result = await service.findByUserId(differentUser.id);

      expect(result).toEqual(differentPreferences);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: differentUser.id } },
      });
    });

    it('should handle repository errors gracefully', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findByUserId(mockUser.id)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('createOrUpdate', () => {
    const updateData = {
      theme: 'light',
      notificationsEnabled: false,
      preferredContentTypes: ['book', 'podcast'],
    };

    it('should update existing user preferences', async () => {
      const updatedPreferences = {
        ...mockUserPreferences,
        ...updateData,
      };

      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);

      const result = await service.createOrUpdate(mockUser.id, updateData);

      expect(result).toEqual(updatedPreferences);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedPreferences);
    });

    it('should create new user preferences when none exist', async () => {
      const newPreferences = {
        ...mockUserPreferences,
        id: 2,
        ...updateData,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newPreferences);
      mockRepository.save.mockResolvedValue(newPreferences);

      const result = await service.createOrUpdate(mockUser.id, updateData);

      expect(result).toEqual(newPreferences);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...updateData,
        user: { id: mockUser.id },
      });
      expect(repository.save).toHaveBeenCalledWith(newPreferences);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { theme: 'light' };
      const updatedPreferences = {
        ...mockUserPreferences,
        theme: 'light',
      };

      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);

      const result = await service.createOrUpdate(mockUser.id, partialUpdate);

      expect(result).toEqual(updatedPreferences);
      expect(repository.save).toHaveBeenCalledWith(updatedPreferences);
    });

    it('should handle different user contexts', async () => {
      const differentUser = TestAuthUtils.createMockUser({
        id: 3,
        email: 'user3@example.com',
      });

      const differentPreferences = {
        ...mockUserPreferences,
        id: 3,
        user: {
          id: differentUser.id,
          email: differentUser.email,
          password: differentUser.password,
          moods: [],
          createdAt: differentUser.createdAt,
          updatedAt: differentUser.updatedAt,
        },
        theme: 'custom',
      };

      mockRepository.findOne.mockResolvedValue(differentPreferences);
      mockRepository.save.mockResolvedValue(differentPreferences);

      const result = await service.createOrUpdate(differentUser.id, updateData);

      expect(result).toEqual(differentPreferences);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: differentUser.id } },
      });
    });

    it('should handle repository errors during update', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockRejectedValue(new Error('Save error'));

      await expect(
        service.createOrUpdate(mockUser.id, updateData),
      ).rejects.toThrow('Save error');
    });

    it('should handle repository errors during creation', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUserPreferences);
      mockRepository.save.mockRejectedValue(new Error('Create error'));

      await expect(
        service.createOrUpdate(mockUser.id, updateData),
      ).rejects.toThrow('Create error');
    });

    it('should handle empty update data', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(mockUserPreferences);

      const result = await service.createOrUpdate(mockUser.id, {});

      expect(result).toEqual(mockUserPreferences);
      expect(repository.save).toHaveBeenCalledWith(mockUserPreferences);
    });

    it('should handle null update data', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(mockUserPreferences);

      const result = await service.createOrUpdate(mockUser.id, null);

      expect(result).toEqual(mockUserPreferences);
      expect(repository.save).toHaveBeenCalledWith(mockUserPreferences);
    });
  });
});
