import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferencesEntity } from './entity/user-preferences.entity';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferencesEntity])],
  providers: [UserPreferencesService],
  controllers: [UserPreferencesController],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
