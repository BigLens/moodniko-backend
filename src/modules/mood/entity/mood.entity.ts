import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@entities/base-entity';
import { UserEntity } from '@modules/user/entity/user.entity';

@Entity('moods')
export class MoodEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  feeling: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
