import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferencesEntity } from './entity/user-preferences.entity';
import {
  UpdateMoodPreferencesDto,
  CreateMoodCategoryDto,
  MoodIntensityRequestDto,
} from './dto/mood-preference.dto';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreferencesEntity)
    private readonly preferencesRepo: Repository<UserPreferencesEntity>,
  ) {}

  // Existing basic preference methods
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

  // New mood-specific preference methods
  async updateMoodPreferences(
    userId: number,
    moodPreferencesDto: UpdateMoodPreferencesDto,
  ) {
    let prefs = await this.findByUserId(userId);
    if (!prefs) {
      prefs = this.preferencesRepo.create({
        user: { id: userId },
        moodPreferences: {},
        moodIntensitySettings: {},
        customMoodCategories: [],
      });
    }

    // Update mood-specific preferences
    if (moodPreferencesDto.mood && moodPreferencesDto.moodPreference) {
      if (!prefs.moodPreferences) {
        prefs.moodPreferences = {};
      }
      prefs.moodPreferences[moodPreferencesDto.mood] =
        moodPreferencesDto.moodPreference;
    }

    // Update intensity settings
    if (moodPreferencesDto.mood && moodPreferencesDto.intensitySettings) {
      if (!prefs.moodIntensitySettings) {
        prefs.moodIntensitySettings = {};
      }
      prefs.moodIntensitySettings[moodPreferencesDto.mood] =
        moodPreferencesDto.intensitySettings;
    }

    // Update other mood-related settings
    if (moodPreferencesDto.customMoodCategories !== undefined) {
      prefs.customMoodCategories = moodPreferencesDto.customMoodCategories;
    }

    if (moodPreferencesDto.defaultIntensityLevels !== undefined) {
      prefs.defaultIntensityLevels = moodPreferencesDto.defaultIntensityLevels;
    }

    if (moodPreferencesDto.enableMoodIntensity !== undefined) {
      prefs.enableMoodIntensity = moodPreferencesDto.enableMoodIntensity;
    }

    if (moodPreferencesDto.enableCustomMoodCategories !== undefined) {
      prefs.enableCustomMoodCategories =
        moodPreferencesDto.enableCustomMoodCategories;
    }

    return this.preferencesRepo.save(prefs);
  }

  async getMoodPreferences(userId: number, mood?: string) {
    const prefs = await this.findByUserId(userId);
    if (!prefs) {
      throw new NotFoundException('User preferences not found');
    }

    if (mood) {
      const moodPref = prefs.moodPreferences?.[mood];
      const intensitySettings = prefs.moodIntensitySettings?.[mood];

      if (!moodPref && !intensitySettings) {
        throw new NotFoundException(`No preferences found for mood: ${mood}`);
      }

      return {
        mood,
        preferences: moodPref,
        intensitySettings,
        defaultIntensityLevels: prefs.defaultIntensityLevels,
        enableMoodIntensity: prefs.enableMoodIntensity,
      };
    }

    return {
      moodPreferences: prefs.moodPreferences || {},
      moodIntensitySettings: prefs.moodIntensitySettings || {},
      customMoodCategories: prefs.customMoodCategories || [],
      defaultIntensityLevels: prefs.defaultIntensityLevels,
      enableMoodIntensity: prefs.enableMoodIntensity,
      enableCustomMoodCategories: prefs.enableCustomMoodCategories,
    };
  }

  async createCustomMoodCategory(
    userId: number,
    categoryDto: CreateMoodCategoryDto,
  ) {
    let prefs = await this.findByUserId(userId);
    if (!prefs) {
      prefs = this.preferencesRepo.create({
        user: { id: userId },
        customMoodCategories: [],
      });
    }

    if (!prefs.customMoodCategories) {
      prefs.customMoodCategories = [];
    }

    // Check if category already exists
    if (prefs.customMoodCategories.includes(categoryDto.categoryName)) {
      throw new BadRequestException(
        `Mood category '${categoryDto.categoryName}' already exists`,
      );
    }

    prefs.customMoodCategories.push(categoryDto.categoryName);
    return this.preferencesRepo.save(prefs);
  }

  async deleteCustomMoodCategory(userId: number, categoryName: string) {
    const prefs = await this.findByUserId(userId);
    if (!prefs || !prefs.customMoodCategories) {
      throw new NotFoundException('No custom mood categories found');
    }

    const index = prefs.customMoodCategories.indexOf(categoryName);
    if (index === -1) {
      throw new NotFoundException(`Mood category '${categoryName}' not found`);
    }

    prefs.customMoodCategories.splice(index, 1);
    return this.preferencesRepo.save(prefs);
  }

  async getContentRecommendationsForMood(
    userId: number,
    moodIntensityRequest: MoodIntensityRequestDto,
  ) {
    const prefs = await this.findByUserId(userId);
    if (!prefs) {
      throw new NotFoundException('User preferences not found');
    }

    const { mood, intensity, preferredContentTypes } = moodIntensityRequest;
    const moodPref = prefs.moodPreferences?.[mood];
    const intensitySettings = prefs.moodIntensitySettings?.[mood];

    if (!moodPref && !intensitySettings) {
      // Return default recommendations based on general preferences
      return {
        contentTypes: prefs.preferredContentTypes || ['movie', 'music'],
        intensity: intensity,
        mood: mood,
        isDefault: true,
      };
    }

    // Get content types based on intensity
    let recommendedContentTypes = moodPref?.preferredContentTypes ||
      prefs.preferredContentTypes || ['movie', 'music'];

    // Filter by intensity if settings exist
    if (intensitySettings?.contentMappings) {
      const intensityFilteredTypes = Object.entries(
        intensitySettings.contentMappings,
      )
        .filter(([, mapping]) => {
          return (
            intensity >= mapping.minIntensity &&
            intensity <= mapping.maxIntensity
          );
        })
        .sort((a, b) => b[1].priority - a[1].priority)
        .map(([contentType]) => contentType);

      if (intensityFilteredTypes.length > 0) {
        recommendedContentTypes = intensityFilteredTypes;
      }
    }

    // Override with user's specific preferences if provided
    if (preferredContentTypes && preferredContentTypes.length > 0) {
      recommendedContentTypes = preferredContentTypes;
    }

    return {
      contentTypes: recommendedContentTypes,
      intensity: intensity,
      mood: mood,
      isDefault: !moodPref && !intensitySettings,
      moodPreferences: moodPref,
      intensitySettings: intensitySettings,
    };
  }

  async resetMoodPreferences(userId: number, mood?: string) {
    const prefs = await this.findByUserId(userId);
    if (!prefs) {
      throw new NotFoundException('User preferences not found');
    }

    if (mood) {
      // Reset specific mood preferences
      if (prefs.moodPreferences?.[mood]) {
        delete prefs.moodPreferences[mood];
      }
      if (prefs.moodIntensitySettings?.[mood]) {
        delete prefs.moodIntensitySettings[mood];
      }
    } else {
      // Reset all mood preferences
      prefs.moodPreferences = {};
      prefs.moodIntensitySettings = {};
      prefs.customMoodCategories = [];
      prefs.defaultIntensityLevels = 5;
      prefs.enableMoodIntensity = true;
      prefs.enableCustomMoodCategories = true;
    }

    return this.preferencesRepo.save(prefs);
  }
}
