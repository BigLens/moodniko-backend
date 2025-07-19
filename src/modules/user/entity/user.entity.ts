import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@entities/base-entity';
import { MoodEntity } from '@modules/mood/entity/mood.entity';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => MoodEntity, (mood) => mood.user)
  moods: MoodEntity[];
}
