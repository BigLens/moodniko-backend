import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { UserContentInteractionEntity } from '@modules/contents/save_contents/entities/user-content-interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserContentInteractionEntity])],
  controllers: [InteractionsController],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}
