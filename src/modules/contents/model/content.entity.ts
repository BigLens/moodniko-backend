import { BaseEntity } from '@entities/base-entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ContentType } from '@modules/contents/enum/content.enum';

@Entity()
export class ContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column({ nullable: true })
  moodtag: string;

  @Column({ nullable: true })
  imageUrl: string;
}
