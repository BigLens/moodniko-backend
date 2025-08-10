import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';
import { ContentsModule } from '../contents/contents.module';

@Module({
  imports: [UserPreferencesModule, ContentsModule],
  providers: [RecommendationService],
  controllers: [RecommendationController],
  exports: [RecommendationService],
})
export class RecommendationModule {}
