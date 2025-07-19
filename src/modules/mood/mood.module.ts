import { Module } from '@nestjs/common';
import { MoodController } from '@modules/mood/mood.controller';
import { MoodService } from '@modules/mood/mood.service';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MoodEntity]), UserModule],
  controllers: [MoodController],
  providers: [MoodService],
})
export class MoodModule {}
