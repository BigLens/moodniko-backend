import { BaseEntity } from '@entities/base-entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class ContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  type: 'movie' | 'music' | 'podcast';

  @Column({ nullable: true })
  moodtag: string;

  @Column({ nullable: true })
  imageUrl: string;
}
