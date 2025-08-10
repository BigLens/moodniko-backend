import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesEntity } from './entity/user-preferences.entity';
import { Repository } from 'typeorm';
import { TestAuthUtils, MockUser } from '../../../test/test-utils';
import {
  UpdateMoodPreferencesDto,
  CreateMoodCategoryDto,
  MoodIntensityRequestDto,
} from './dto/mood-preference.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let repository: Repository<UserPreferencesEntity>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

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
    moodPreferences: {
      happy: {
        intensityLevels: [1, 2, 3, 4, 5],
        preferredContentTypes: ['comedy', 'pop'],
        customCategories: ['uplifting'],
        defaultPreferences: {
          contentTypes: ['comedy', 'pop'],
          intensityThreshold: 3,
        },
      },
    },
    moodIntensitySettings: {
      happy: {
        minIntensity: 1,
        maxIntensity: 5,
        contentMappings: {
          comedy: { minIntensity: 1, maxIntensity: 5, priority: 1 },
          pop: { minIntensity: 1, maxIntensity: 5, priority: 2 },
        },
      },
    },
    customMoodCategories: ['uplifting', 'energetic'],
    defaultIntensityLevels: 5,
    enableMoodIntensity: true,
    enableCustomMoodCategories: true,
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
      const updatedPreferences = { ...mockUserPreferences, ...updateData };
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);
      const result = await service.createOrUpdate(mockUser.id, updateData);
      expect(result).toEqual(updatedPreferences);
    });

    it('should create new user preferences when none exist', async () => {
      const newPreferences = { ...mockUserPreferences, id: 2, ...updateData };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newPreferences);
      mockRepository.save.mockResolvedValue(newPreferences);
      const result = await service.createOrUpdate(mockUser.id, updateData);
      expect(result).toEqual(newPreferences);
    });

    it('should handle repository errors during update', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockRejectedValue(new Error('Save error'));
      await expect(
        service.createOrUpdate(mockUser.id, updateData),
      ).rejects.toThrow('Save error');
    });
  });

  // New mood-specific preference tests
  describe('updateMoodPreferences', () => {
    const moodPreferencesDto: UpdateMoodPreferencesDto = {
      mood: 'happy',
      moodPreference: {
        intensityLevels: [1, 2, 3, 4, 5],
        preferredContentTypes: ['comedy', 'pop'],
        customCategories: ['uplifting'],
        defaultPreferences: {
          contentTypes: ['comedy', 'pop'],
          intensityThreshold: 3,
        },
      },
    };

    it('should update mood preferences for existing user preferences', async () => {
      const updatedPreferences = { ...mockUserPreferences };
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);
      const result = await service.updateMoodPreferences(
        mockUser.id,
        moodPreferencesDto,
      );
      expect(result).toEqual(updatedPreferences);
    });

    it('should create new user preferences with mood preferences when none exist', async () => {
      const newPreferences = { ...mockUserPreferences, id: 2 };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newPreferences);
      mockRepository.save.mockResolvedValue(newPreferences);
      const result = await service.updateMoodPreferences(
        mockUser.id,
        moodPreferencesDto,
      );
      expect(result).toEqual(newPreferences);
    });
  });

  describe('getMoodPreferences', () => {
    it('should get all mood preferences when no specific mood is provided', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      const result = await service.getMoodPreferences(mockUser.id);
      expect(result).toEqual({
        moodPreferences: mockUserPreferences.moodPreferences,
        moodIntensitySettings: mockUserPreferences.moodIntensitySettings,
        customMoodCategories: mockUserPreferences.customMoodCategories,
        defaultIntensityLevels: mockUserPreferences.defaultIntensityLevels,
        enableMoodIntensity: mockUserPreferences.enableMoodIntensity,
        enableCustomMoodCategories:
          mockUserPreferences.enableCustomMoodCategories,
      });
    });

    it('should get specific mood preferences when mood is provided', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      const result = await service.getMoodPreferences(mockUser.id, 'happy');
      expect(result).toEqual({
        mood: 'happy',
        preferences: mockUserPreferences.moodPreferences['happy'],
        intensitySettings: mockUserPreferences.moodIntensitySettings['happy'],
        defaultIntensityLevels: mockUserPreferences.defaultIntensityLevels,
        enableMoodIntensity: mockUserPreferences.enableMoodIntensity,
      });
    });

    it('should throw NotFoundException when user preferences not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.getMoodPreferences(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when specific mood preferences not found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      await expect(
        service.getMoodPreferences(mockUser.id, 'sad'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCustomMoodCategory', () => {
    const categoryDto: CreateMoodCategoryDto = {
      categoryName: 'new-category',
      description: 'A new mood category',
      relatedMoods: ['happy', 'excited'],
    };

    it('should create custom mood category for existing user preferences', async () => {
      const updatedPreferences = { ...mockUserPreferences };
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);
      const result = await service.createCustomMoodCategory(
        mockUser.id,
        categoryDto,
      );
      expect(result).toEqual(updatedPreferences);
    });

    it('should create new user preferences with custom mood category when none exist', async () => {
      const newPreferences = {
        ...mockUserPreferences,
        id: 2,
        customMoodCategories: [],
      };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newPreferences);
      mockRepository.save.mockResolvedValue(newPreferences);
      const result = await service.createCustomMoodCategory(
        mockUser.id,
        categoryDto,
      );
      expect(result).toEqual(newPreferences);
    });

    it('should throw BadRequestException when category already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      await expect(
        service.createCustomMoodCategory(mockUser.id, {
          categoryName: 'uplifting',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteCustomMoodCategory', () => {
    it('should delete custom mood category successfully', async () => {
      const updatedPreferences = { ...mockUserPreferences };
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);
      const result = await service.deleteCustomMoodCategory(
        mockUser.id,
        'uplifting',
      );
      expect(result).toEqual(updatedPreferences);
    });

    it('should throw NotFoundException when user preferences not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.deleteCustomMoodCategory(mockUser.id, 'uplifting'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      await expect(
        service.deleteCustomMoodCategory(mockUser.id, 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getContentRecommendationsForMood', () => {
    const moodIntensityRequest: MoodIntensityRequestDto = {
      mood: 'happy',
      intensity: 4,
      preferredContentTypes: ['comedy', 'pop'],
    };

    it('should return content recommendations for mood with preferences', async () => {
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      const result = await service.getContentRecommendationsForMood(
        mockUser.id,
        moodIntensityRequest,
      );
      expect(result).toEqual({
        contentTypes: ['comedy', 'pop'],
        intensity: 4,
        mood: 'happy',
        isDefault: false,
        moodPreferences: mockUserPreferences.moodPreferences['happy'],
        intensitySettings: mockUserPreferences.moodIntensitySettings['happy'],
      });
    });

    it('should return default recommendations when no mood preferences exist', async () => {
      const userPrefsWithoutMood = {
        ...mockUserPreferences,
        moodPreferences: {},
        moodIntensitySettings: {},
      };
      mockRepository.findOne.mockResolvedValue(userPrefsWithoutMood);
      const result = await service.getContentRecommendationsForMood(
        mockUser.id,
        moodIntensityRequest,
      );
      expect(result).toEqual({
        contentTypes: userPrefsWithoutMood.preferredContentTypes,
        intensity: 4,
        mood: 'happy',
        isDefault: true,
      });
    });

    it('should throw NotFoundException when user preferences not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.getContentRecommendationsForMood(
          mockUser.id,
          moodIntensityRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetMoodPreferences', () => {
    it('should reset all mood preferences when no specific mood is provided', async () => {
      const updatedPreferences = { ...mockUserPreferences };
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);
      const result = await service.resetMoodPreferences(mockUser.id);
      expect(result).toEqual(updatedPreferences);
    });

    it('should reset specific mood preferences when mood is provided', async () => {
      const updatedPreferences = { ...mockUserPreferences };
      mockRepository.findOne.mockResolvedValue(mockUserPreferences);
      mockRepository.save.mockResolvedValue(updatedPreferences);
      const result = await service.resetMoodPreferences(mockUser.id, 'happy');
      expect(result).toEqual(updatedPreferences);
    });

    it('should throw NotFoundException when user preferences not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.resetMoodPreferences(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
