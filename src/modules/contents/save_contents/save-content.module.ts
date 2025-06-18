import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveContentController } from './save-content.controller';
import { SaveContentService } from './save-content.service';
import { SavedContent } from './save-content.entity';
import { ContentEntity } from '../model/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedContent, ContentEntity])],
  controllers: [SaveContentController],
  providers: [SaveContentService],
  exports: [SaveContentService],
})
export class SaveContentModule {}
