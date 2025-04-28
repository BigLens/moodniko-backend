import { Module } from '@nestjs/common';
import { MoodController } from '@modules/mood/mood.controller';
import { MoodService } from '@modules/mood/mood.service';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([MoodEntity])],
	controllers: [MoodController],
	providers: [MoodService]
})
export class MoodModule {}
