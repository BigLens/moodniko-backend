import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'
import { BaseEntity }  from 'src/entities/base-entity'

@Entity('moods')
export class MoodEntity extends BaseEntity{
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	feeling: string
}
