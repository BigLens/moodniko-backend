import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@entities/base-entity';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => MoodEntity, (mood) => mood.user)
  moods: MoodEntity[];
}
