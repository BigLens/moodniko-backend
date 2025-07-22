import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserPreferencesModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
