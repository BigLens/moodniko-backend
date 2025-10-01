import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@modules/user/entity/user.entity';
import { ContentEntity } from '@modules/contents/model/content.entity';
import { BaseEntity } from '@entities/base-entity';
// import { InteractionType } from './../enum/interactiontype.enum';


export enum InteractionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  SAVE = 'save',
  SHARE = 'share',
  SKIP = 'skip',
  PLAY = 'play',
  COMPLETE = 'complete',
  RATE = 'rate',
}

@Entity('user_content_interactions')
@Index(['userId', 'contentId'])
@Index(['interactionType'])
@Index(['createdAt'])
@Index(['moodAtInteraction'])
export class UserContentInteractionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'content_id' })
  contentId: number;

  @Column({
    type: 'enum',
    enum: InteractionType,
    name: 'interaction_type',
  })
  interactionType: InteractionType;

  @Column({
    type: 'int',
    nullable: true,
    name: 'interaction_value',
  })
  interactionValue?: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'mood_at_interaction',
  })
  moodAtInteraction?: string;

  @Column({
    type: 'int',
    nullable: true,
    name: 'mood_intensity_at_interaction',
  })
  moodIntensityAtInteraction?: number;

  @Column({
    type: 'int',
    nullable: true,
    name: 'interaction_duration_seconds',
  })
  interactionDurationSeconds?: number;

  @Column({ type: 'text', nullable: true })
  context?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ContentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content: ContentEntity;
}
