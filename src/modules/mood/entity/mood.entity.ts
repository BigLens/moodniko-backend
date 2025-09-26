import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '@entities/base-entity';
import { UserEntity } from '@modules/user/entity/user.entity';

@Entity('moods')
@Index(['createdAt', 'user'])
@Index(['feeling', 'user'])
@Index(['intensity'])
export class MoodEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  feeling: string;

  @Column({ type: 'int', nullable: true, default: 5 })
  intensity: number;

  @Column({ type: 'text', nullable: true })
  context: string;

  @Column({ type: 'text', array: true, nullable: true })
  triggers: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  weather: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  activity: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  socialContext: string;

  @Column({ type: 'int', nullable: true, default: 5 })
  energyLevel: number;

  @Column({ type: 'int', nullable: true, default: 5 })
  stressLevel: number;

  @Column({ type: 'int', nullable: true, default: 5 })
  sleepQuality: number;

  @Column({ type: 'int', nullable: true })
  moodDurationMinutes: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  moodChangeReason: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
