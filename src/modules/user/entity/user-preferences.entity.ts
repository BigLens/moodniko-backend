import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@entities/base-entity';
import { UserEntity } from './user.entity';

@Entity('user_preferences')
export class UserPreferencesEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column('simple-array', { nullable: true })
  preferredContentTypes: string[];
} 