import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@entities/base-entity';
import { UserEntity } from '@modules/user/entity/user.entity';

export interface MoodPreference {
  intensityLevels: number[];
  preferredContentTypes: string[];
  customCategories: string[];
  defaultPreferences: {
    contentTypes: string[];
    intensityThreshold: number;
  };
}

export interface MoodIntensitySettings {
  minIntensity: number;
  maxIntensity: number;
  contentMappings: {
    [contentType: string]: {
      minIntensity: number;
      maxIntensity: number;
      priority: number;
    };
  };
}

@Entity('user_preferences')
export class UserPreferencesEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Basic preferences (existing)
  @Column({ default: 'light' })
  theme: string;

  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column('simple-array', { nullable: true })
  preferredContentTypes: string[];

  // Mood-specific preferences (new)
  @Column('json', { nullable: true })
  moodPreferences: {
    [mood: string]: MoodPreference;
  };

  @Column('json', { nullable: true })
  moodIntensitySettings: {
    [mood: string]: MoodIntensitySettings;
  };

  @Column('simple-array', { nullable: true })
  customMoodCategories: string[];

  @Column({ default: 5 })
  defaultIntensityLevels: number; // Default number of intensity levels (1-5, 1-10, etc.)

  @Column({ default: true })
  enableMoodIntensity: boolean; // Toggle for mood intensity feature

  @Column({ default: true })
  enableCustomMoodCategories: boolean; // Toggle for custom mood categories
}
