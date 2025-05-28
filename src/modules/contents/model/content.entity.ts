import { BaseEntity } from '@entities/base-entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ContentType } from '@modules/contents/enum/content.enum';

@Entity('contents')
@Unique(['externalId', 'type'])
export class ContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'external_id' })
  externalId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column()
  moodtag: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
