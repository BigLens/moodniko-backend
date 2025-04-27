import { Module } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';
import { MoodEntity } from './entity/mood.entity';

@Module({
	imports: [TypeOrm.forFeature([MoodEntity])],
	controllers: [MoodController],
	providers: [MoodService]
})
export class MoodModule {}
