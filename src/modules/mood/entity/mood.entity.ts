import { Entity, PrimaryGeneratedColumn, Column}
import { BaseEntity } from '../../../entities/base-entity'

@Entity()
export class MoodEntity extends BaseEntity{
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	feeling: string
}
