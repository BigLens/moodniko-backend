import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { BaseEntity } from '@entities/base-entity';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashing will be handled in the service layer
}
