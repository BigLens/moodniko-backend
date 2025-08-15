import { Module } from '@nestjs/common';
import { MoodController } from '@modules/mood/mood.controller';
import { MoodService } from '@modules/mood/mood.service';
import { MoodHistoryController } from '@modules/mood/mood-history/mood-history.controller';
import { MoodHistoryService } from '@modules/mood/mood-history/mood-history.service';
import { MoodEntity } from '@modules/mood/entity/mood.entity';
import { UserContentInteractionEntity } from '@modules/contents/save_contents/entities/user-content-interaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoodEntity, UserContentInteractionEntity]),
    UserModule,
  ],
  controllers: [MoodController, MoodHistoryController],
  providers: [MoodService, MoodHistoryService],
  exports: [MoodHistoryService],
})
export class MoodModule {}
