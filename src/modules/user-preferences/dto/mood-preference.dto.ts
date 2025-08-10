import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DefaultPreferencesDto {
  @IsArray()
  @IsString({ each: true })
  contentTypes: string[];

  @IsNumber()
  intensityThreshold: number;
}

export class MoodPreferenceDto {
  @IsArray()
  @IsNumber({}, { each: true })
  intensityLevels: number[];

  @IsArray()
  @IsString({ each: true })
  preferredContentTypes: string[];

  @IsArray()
  @IsString({ each: true })
  customCategories: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => DefaultPreferencesDto)
  defaultPreferences: DefaultPreferencesDto;
}

export class ContentMappingDto {
  @IsNumber()
  minIntensity: number;

  @IsNumber()
  maxIntensity: number;

  @IsNumber()
  priority: number;
}

export class MoodIntensitySettingsDto {
  @IsNumber()
  minIntensity: number;

  @IsNumber()
  maxIntensity: number;

  @IsObject()
  contentMappings: {
    [contentType: string]: ContentMappingDto;
  };
}

export class UpdateMoodPreferencesDto {
  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MoodPreferenceDto)
  moodPreference?: MoodPreferenceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MoodIntensitySettingsDto)
  intensitySettings?: MoodIntensitySettingsDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customMoodCategories?: string[];

  @IsOptional()
  @IsNumber()
  defaultIntensityLevels?: number;

  @IsOptional()
  @IsBoolean()
  enableMoodIntensity?: boolean;

  @IsOptional()
  @IsBoolean()
  enableCustomMoodCategories?: boolean;
}

export class CreateMoodCategoryDto {
  @IsString()
  categoryName: string;

  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  relatedMoods?: string[];
}

export class MoodIntensityRequestDto {
  @IsString()
  mood: string;

  @IsNumber()
  intensity: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredContentTypes?: string[];
}
