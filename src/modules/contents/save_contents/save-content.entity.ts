import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContentEntity } from '../model/content.entity';

@Entity('saved_contents')
export class SavedContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contentId: number;

  @Column()
  mood: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ContentEntity)
  @JoinColumn({ name: 'contentId' })
  content: ContentEntity;
}
