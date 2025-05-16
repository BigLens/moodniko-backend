import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { HttpModule } from '@nestjs/axios';
import { BooksController } from './books.controller';

@Module({
  imports: [HttpModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
