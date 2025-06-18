import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ContentEntity } from '../model/content.entity';

@Entity('saved_contents')
@Index('IDX_SAVED_CONTENTS_CONTENT_ID', ['contentId'])
@Index('IDX_SAVED_CONTENTS_MOOD', ['mood'])
@Index('IDX_SAVED_CONTENTS_CREATED_AT', ['createdAt'])
@Index('IDX_SAVED_CONTENTS_UNIQUE', ['contentId', 'mood'], { unique: true })
export class SavedContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content_id' })
  contentId: number;

  @Column({ length: 50 })
  mood: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => ContentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content: ContentEntity;
}
